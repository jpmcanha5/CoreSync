# Configuração do Google Sign-In no CoreSync

## Problema Atual
Erro 400 ao tentar fazer login com Google. Este arquivo contém o guia completo de configuração.

## Passo 1: Configurar no Google Cloud Console

### 1.1 Criar/Acessar Projeto
1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Ative a API "Google+ API"

### 1.2 Criar OAuth 2.0 Credentials

#### Para Android:
1. Vá para **Credenciais** → **Criar Credencial** → **ID OAuth de cliente** → **Aplicativo Android**
2. Você precisa do SHA-1 fingerprint. Execute no terminal:
   ```bash
   # Windows PowerShell
   keytool -list -v -keystore $env:USERPROFILE\.android\debug.keystore -alias androiddebugkey -storepass android -keypass android
   ```
3. Procure pelo "SHA1:" e copie o valor (sem os dois pontos)
4. Insira o nome do pacote: `com.joao.coresync`
5. Cole o SHA-1 fingerprint
6. Clique em "Criar"
7. **Copie o Client ID do Android**

#### Para iOS:
1. **Credencial** → **ID OAuth de cliente** → **Aplicativo iOS**
2. Nome do pacote: `com.joao.coresync`
3. ID do pacote (Bundle ID): `com.joao.coresync`
4. **Copie o Client ID do iOS**

#### Para Web (suporte adicionado):
1. **Credencial** → **ID OAuth de cliente** → **Aplicação web**
2. URIs autorizados de redirecionamento JavaScript:
   - `http://localhost:19006`
   - `http://localhost:8081`
   - `exp://localhost:19000`
   - `exp.direct://localhost:19000`
3. URIs autorizados de redirecionamento:
   - `http://localhost:19006/auth`
   - `exp://localhost:19000/auth`
4. **Copie o Client ID Web**

## Passo 2: Atualizar o Código

### 2.1 Substituir os Client IDs em `app/index.tsx`

```typescript
const [request, response, promptAsync] = Google.useAuthRequest({
  clientId: "SEU_WEB_CLIENT_ID_AQUI",
  iosClientId: "SEU_IOS_CLIENT_ID_AQUI",
  androidClientId: "SEU_ANDROID_CLIENT_ID_AQUI",
  scopes: ['profile', 'email'],
});
```

## Passo 3: Configurar Deep Linking

O arquivo `app.json` já está parcialmente configurado. Confirme que tem:

```json
{
  "expo": {
    "scheme": "coresync-app",
    "plugins": [
      "expo-router",
      "expo-web-browser"
    ]
  }
}
```

## Passo 4: Testar Localmente

### Para Web:
```bash
npm run web
```

### Para Android:
```bash
npm run android
```

### Para iOS:
```bash
npm run ios
```

## Passo 5: Debugar Erros

Se continuar com erro 400:

1. **Verifique os Client IDs** - Certifique-se de que estão corretos
2. **Verifique SHA-1 do Android** - Deve estar registrado no Google Cloud
3. **Verifique Deep Linking** - O scheme deve estar correto
4. **Limpe o cache**:
   ```bash
   npm run reset-project
   ```
5. **Verifique os logs** no console do seu projeto Expo

## Erro Comum: 400 Bad Request

Causas:
- ❌ Client ID incorreto ou não registrado
- ❌ SHA-1 do Android não configurado
- ❌ Scheme de deep linking incorreto
- ❌ URI de redirecionamento não autorizado no Google Cloud
- ✅ **Solução**: Seguir os passos acima com cuidado

## Próximas Etapas

Após configurar corretamente:

1. O login do Google funcionará
2. Os dados do usuário serão capturados automaticamente
3. O usuário será autenticado e redirecionado para a tela principal

---

**Status**: Configuração básica pronta. Aguardando Client IDs corretos do Google Cloud Console.
