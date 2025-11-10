import { SectionCards } from '@/components/section-cards';
import { ChartAreaInteractive } from '@/components/chart-area-interactive';
import { DataTable } from '@/components/data-table';
import tableData from '@/app/dashboard/data.json';

export default function Dashboard() {
  return (
    <div className="@container/main flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="px-4 lg:px-6">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard SuperAdmin</h1>
        <p className="text-muted-foreground">
          Visão geral do sistema Multi-OBS Saúde
        </p>
      </div>

      {/* Cards de estatísticas com gradiente e badges de trending */}
      <SectionCards />

      {/* Gráfico interativo de área com controles de período */}
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>

      {/* Tabela de dados interativa com drag & drop, filtros e paginação */}
      <DataTable data={tableData} />
    </div>
  );
}
