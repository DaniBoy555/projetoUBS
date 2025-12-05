import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const supabase = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        // Apenas POST é permitido
        if (req.method !== 'POST') {
            throw new Error('Method not allowed')
        }

        const body = await req.json()
        const { tipo_dado, conteudo, origem } = body

        if (!tipo_dado || !conteudo) {
            throw new Error('Missing required fields: tipo_dado, conteudo')
        }

        let tableName = ''
        if (tipo_dado === 'PEC') {
            tableName = 'consolidado_pec'
        } else if (tipo_dado === 'CDS') {
            tableName = 'consolidado_cds'
        } else {
            throw new Error('Invalid tipo_dado. Must be PEC or CDS')
        }

        // Inserir no Warehouse
        const { data, error } = await supabase
            .schema('warehouse')
            .from(tableName)
            .insert({
                origem_dado: origem || { source: 'api' },
                conteudo: conteudo
            })
            .select()

        if (error) {
            console.error('Error inserting data:', error)
            throw error
        }

        // Logar auditoria (opcional, mas bom ter)
        await supabase.from('audit_logs').insert({
            action: 'DATA_INGESTION',
            resource: 'warehouse',
            details: { tipo: tipo_dado, status: 'success' },
            action: 'INGEST_DATA'
        })

        return new Response(
            JSON.stringify({ message: 'Dados ingeridos com sucesso', data }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200,
            }
        )

    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400,
            }
        )
    }
})
