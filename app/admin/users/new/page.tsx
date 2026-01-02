// app/admin/users/new/page.tsx
import { UserForm } from '@/components/admin/forms/UserForm'

export const dynamic = 'force-dynamic'

export default function CreateUserPage() {
    return (
        <div className="max-w-5xl mx-auto py-8 px-6">
            <UserForm mode="create" />
        </div>
    )
}
