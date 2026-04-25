import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
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
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  let UpdateAtText = "carregando...";
  if (!isLoading && data) {
    UpdateAtText = new Date(data.updated_at).toLocaleString("pt-BR");
  }
  return <div>Ultima Atualização:{UpdateAtText}</div>;
}

function DataBaseStatus() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  let dabaseStatusInformation = "Carregando...";
  if (!isLoading && data) {
    dabaseStatusInformation = (
      <>
        <div>Versão: {data.dependencies.database.version}</div>
        <div>
          Conexões abertas: {data.dependencies.database.opened_connections}
        </div>
        <div>
          Conexões Maxinax: {data.dependencies.database.max_connections}
        </div>
      </>
    );
    return (
      <>
        <h2>Dados do DB{dabaseStatusInformation}</h2>
      </>
    );
  }
}
