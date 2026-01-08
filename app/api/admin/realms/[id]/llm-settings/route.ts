// app/api/admin/realms/[id]/llm-settings/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAuthAPI } from "@/lib/utils/auth";
import { updateRealmLlmSettings } from "@/lib/utils/realm-settings";

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await requireAuthAPI()
        const { id: realmId } = await params
        const body = await req.json()

        if (!body.accounts || !Array.isArray(body.accounts)) {
            return NextResponse.json({ error: "Invalid accounts data" }, { status: 400 })
        }

        if (typeof body.auto_analyze !== "boolean") {
            return NextResponse.json({ error: "Invalid auto_analyze value" }, { status: 400 })
        }

        if (body.realm_context !== undefined && typeof body.realm_context !== 'string') {
            return NextResponse.json({ error: 'Invalid realm_context value' }, { status: 400 })
        }

        if (body.realm_holder_name !== undefined && typeof body.realm_holder_name !== 'string') {
            return NextResponse.json({ error: 'Invalid realm_holder_name value' }, { status: 400 })
        }

        await updateRealmLlmSettings(realmId, {
            accounts: body.accounts,
            default_account_id: body.default_account_id || null,
            auto_analyze: body.auto_analyze,
            realm_context: body.realm_context,
            realm_holder_name: body.realm_holder_name,
        })

        return NextResponse.json({ success: true })

    } catch (error) {

        console.error("LLM settings update error:", error)
        return NextResponse.json(
            { error: "Failed to update settings" },
            { status: 500 }
        )

    }
}
