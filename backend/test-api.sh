#!/bin/bash

BASE_URL="http://localhost:3001/api"

echo "🧪 Testando API do Task Manager"
echo "================================"

echo -e "\n1️⃣ Health Check"
curl -s "$BASE_URL/../health" | jq '.'

echo -e "\n2️⃣ Registro de Usuário"
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456"}')
echo "$REGISTER_RESPONSE" | jq '.'

echo -e "\n3️⃣ Login"
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456"}')
echo "$LOGIN_RESPONSE" | jq '.'

TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.data.accessToken')
REFRESH_TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.data.refreshToken')

if [ "$TOKEN" = "null" ] || [ -z "$TOKEN" ]; then
  echo "❌ Falha ao obter token"
  exit 1
fi

echo -e "\n4️⃣ Criar Tarefa"
TASK_RESPONSE=$(curl -s -X POST "$BASE_URL/tasks" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title":"Minha primeira tarefa","description":"Descrição de teste"}')
echo "$TASK_RESPONSE" | jq '.'

TASK_ID=$(echo "$TASK_RESPONSE" | jq -r '.data.id')

echo -e "\n5️⃣ Listar Tarefas"
curl -s -X GET "$BASE_URL/tasks" \
  -H "Authorization: Bearer $TOKEN" | jq '.'

echo -e "\n6️⃣ Toggle Status"
curl -s -X PATCH "$BASE_URL/tasks/$TASK_ID/toggle" \
  -H "Authorization: Bearer $TOKEN" | jq '.'

echo -e "\n7️⃣ Atualizar Tarefa"
curl -s -X PUT "$BASE_URL/tasks/$TASK_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title":"Tarefa atualizada"}' | jq '.'

echo -e "\n8️⃣ Refresh Token"
curl -s -X POST "$BASE_URL/auth/refresh" \
  -H "Content-Type: application/json" \
  -d "{\"refreshToken\":\"$REFRESH_TOKEN\"}" | jq '.'

echo -e "\n9️⃣ Logout"
curl -s -X POST "$BASE_URL/auth/logout" \
  -H "Content-Type: application/json" \
  -d "{\"refreshToken\":\"$REFRESH_TOKEN\"}" | jq '.'

echo -e "\n🔟 Deletar Tarefa"
curl -s -X DELETE "$BASE_URL/tasks/$TASK_ID" \
  -H "Authorization: Bearer $TOKEN" -w "\nStatus: %{http_code}\n"

echo -e "\n✅ Testes concluídos!"
