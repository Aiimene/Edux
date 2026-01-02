# Backend Admin Account Management Updates

## Required Backend Changes

### 1. Update SubscriptionPlan Model (apps/settings/models.py)

Add `max_users` field to the `SubscriptionPlan` class:

```python
max_users = models.IntegerField(
    default=999999,
    help_text='Maximum number of users allowed (999999 = unlimited)'
)
```

Then run migrations:
```bash
python manage.py makemigrations
python manage.py migrate
```

### 2. Add Admin Views (apps/settings/views.py)

Add these imports at the top:
```python
from django.db.models import Count, Q
from apps.authentication.models import Workspace
from apps.members.models import Teacher, Student, Parent
from decimal import Decimal
```

Add these view functions:

```python
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_all_accounts(request):
    """GET: List all workspaces/accounts (admin only)"""
    # Simple admin check - in production, use proper admin role
    if not request.user.is_superuser and request.user.username != 'admin':
        return Response(
            {'error': 'Admin access required'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    workspaces = Workspace.objects.all()
    accounts_data = []
    
    for workspace in workspaces:
        # Get subscription plan
        plan = SubscriptionPlan.objects.filter(workspace=workspace).first()
        
        # Count users
        teachers_count = Teacher.objects.filter(workspace=workspace).count()
        students_count = Student.objects.filter(workspace=workspace).count()
        parents_count = Parent.objects.filter(workspace=workspace).count()
        total_users = teachers_count + students_count + parents_count
        
        # Get last payment
        last_payment = Payment.objects.filter(workspace=workspace).order_by('-date').first()
        
        accounts_data.append({
            'id': workspace.id,
            'workspaceName': workspace.display_name or workspace.name,
            'email': workspace.email or '',
            'currentPlan': plan.plan_name if plan else 'No Plan',
            'maxUsers': plan.max_users if plan else 999999,
            'currentUsers': total_users,
            'status': plan.status if plan else 'inactive',
            'lastPayment': last_payment.date.strftime('%Y-%m-%d') if last_payment else None,
        })
    
    return Response({'accounts': accounts_data}, status=status.HTTP_200_OK)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def admin_update_account_plan(request, workspace_id):
    """PUT: Update account plan (admin only)"""
    if not request.user.is_superuser and request.user.username != 'admin':
        return Response(
            {'error': 'Admin access required'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    try:
        workspace = Workspace.objects.get(id=workspace_id)
    except Workspace.DoesNotExist:
        return Response(
            {'error': 'Workspace not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    plan_name = request.data.get('planName')
    max_users = request.data.get('maxUsers', 999999)
    price = request.data.get('price', 299.00)
    plan_status = request.data.get('status', 'active')
    
    plan, created = SubscriptionPlan.objects.get_or_create(
        workspace=workspace,
        defaults={
            'plan_name': plan_name,
            'max_users': max_users,
            'price': Decimal(str(price)),
            'status': plan_status,
        }
    )
    
    if not created:
        plan.plan_name = plan_name
        plan.max_users = max_users
        plan.price = Decimal(str(price))
        plan.status = plan_status
        plan.save()
    
    return Response({
        'success': True,
        'message': 'Plan updated successfully',
        'plan': PlanSerializer(plan).data
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_pending_payments(request):
    """GET: List all pending payments (admin only)"""
    if not request.user.is_superuser and request.user.username != 'admin':
        return Response(
            {'error': 'Admin access required'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    pending_payments = Payment.objects.filter(status='pending').order_by('-created_at')
    
    payments_data = []
    for payment in pending_payments:
        payments_data.append({
            'id': payment.id,
            'paymentId': payment.payment_id,
            'workspaceName': payment.workspace.display_name or payment.workspace.name,
            'date': payment.date.strftime('%d %B %Y'),
            'method': payment.method,
            'amount': f"{payment.amount}{payment.currency}",
            'proof': payment.proof,
        })
    
    return Response({'payments': payments_data}, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def admin_approve_payment(request, payment_id):
    """POST: Approve or reject payment (admin only)"""
    if not request.user.is_superuser and request.user.username != 'admin':
        return Response(
            {'error': 'Admin access required'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    try:
        payment = Payment.objects.get(id=payment_id)
    except Payment.DoesNotExist:
        return Response(
            {'error': 'Payment not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    action = request.data.get('action')
    notes = request.data.get('notes', '')
    
    if action == 'approve':
        payment.status = 'approved'
        payment.notes = notes or 'Payment approved by admin'
        
        # Update subscription plan status to active
        plan = SubscriptionPlan.objects.filter(workspace=payment.workspace).first()
        if plan:
            plan.status = 'active'
            plan.save()
        
        payment.save()
        
        return Response({
            'success': True,
            'message': 'Payment approved successfully',
            'payment': PaymentSerializer(payment).data
        }, status=status.HTTP_200_OK)
    
    elif action == 'reject':
        payment.status = 'failed'
        payment.notes = notes or 'Payment rejected by admin'
        payment.save()
        
        return Response({
            'success': True,
            'message': 'Payment rejected',
            'payment': PaymentSerializer(payment).data
        }, status=status.HTTP_200_OK)
    
    else:
        return Response(
            {'error': 'Invalid action. Use "approve" or "reject"'},
            status=status.HTTP_400_BAD_REQUEST
        )
```

### 3. Update URLs (apps/settings/urls.py)

Add these paths to `urlpatterns`:

```python
# Admin Account Management
path('admin/accounts/', views.admin_all_accounts, name='admin-all-accounts'),
path('admin/accounts/<int:workspace_id>/plan/', views.admin_update_account_plan, name='admin-update-account-plan'),
path('admin/payments/pending/', views.admin_pending_payments, name='admin-pending-payments'),
path('admin/payments/<int:payment_id>/approve/', views.admin_approve_payment, name='admin-approve-payment'),
```

## Admin Credentials

The admin account management page uses these default credentials:
- **Username:** `admin`
- **Password:** `EduxAdmin2025!`

**IMPORTANT:** Change these credentials in production by updating `src/app/admin/account-management/layout.tsx`

## Plans

The system supports 3 plans:
1. **Basic Plan:** 100 users - $99/month
2. **Professional Plan:** 500 users - $299/month
3. **Enterprise Plan:** Unlimited users - $599/month

