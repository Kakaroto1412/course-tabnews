const { exec } = require("node:child_process");

function checkPostgres() {
  exec("pg_isready -h localhost -p 5432 -U postgres", handleReturn);

  function handleReturn(error, stdout) {
    if (error || !stdout.includes("accepting connections")) {
      process.stdout.write(".");
      setTimeout(checkPostgres, 1000);
      return;
    }

    console.log("\n🟢 Postgres está pronto e acessível!\n");
  }
}

process.stdout.write("\n\n🔴 Aguardando Postgres aceitar conexões");
checkPostgres();
