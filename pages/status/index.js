import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  return response.json();
}

export default function StatusPage() {
  return (
    <>
      <h1>Status</h1>
      <UpdateAt />
      <DataBaseStatus />
    </>
  );
}

function UpdateAt() {
  const { data, error, isLoading } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  if (error) return <div>Erro ao carregar: {error.message}</div>;
  if (isLoading) return <div>Carregando...</div>;

  return (
    <div>
      Última Atualização: {new Date(data.updated_at).toLocaleString("pt-BR")}
    </div>
  );
}

function DataBaseStatus() {
  const { data, error, isLoading } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  if (error) return <div>Erro ao carregar banco: {error.message}</div>;
  if (isLoading) return <div>Carregando dados do banco...</div>;

  const db = data.dependencies.database;

  return (
    <>
      <h2>Dados do Banco</h2>
      <div>Versão: {db.version}</div>
      <div>Conexões abertas: {db.opened_connections}</div>
      <div>Conexões máximas: {db.max_connections}</div>
    </>
  );
}
