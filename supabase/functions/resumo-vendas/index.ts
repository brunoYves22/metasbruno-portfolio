import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const DAILY_GOAL = 20

function isToday(dateString: string): boolean {
  const date = new Date(dateString)
  const today = new Date()
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  )
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Fetch all sales
    const { data: sales, error } = await supabase
      .from('sales')
      .select('*')

    if (error) {
      throw error
    }

    // Calculate totals (only recognized products with commission > 0)
    const recognizedSales = sales?.filter(sale => sale.recognized && sale.commission > 0) || []
    
    const totalComissaoAcumulada = recognizedSales.reduce(
      (sum, sale) => sum + Number(sale.commission), 
      0
    )

    const totalVendas = sales?.length || 0

    // Calculate today's commission for goal status
    const todaySales = recognizedSales.filter(sale => isToday(sale.date))
    const comissaoHoje = todaySales.reduce(
      (sum, sale) => sum + Number(sale.commission), 
      0
    )

    const metaDiaria = DAILY_GOAL
    const metaBatida = comissaoHoje >= DAILY_GOAL

    const response = {
      totalComissaoAcumulada,
      totalVendas,
      metaDiaria,
      comissaoHoje,
      metaBatida,
      statusMeta: metaBatida ? 'META BATIDA 🎯' : 'META NÃO BATIDA ❌'
    }

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return new Response(JSON.stringify({ error: message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
