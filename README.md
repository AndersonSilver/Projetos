<h1 align="center"> Configurações </h1>

### 1º - instalar as dependencias

    
>**yarn**

### 2º - crie um arquivo `.env` na raiz do projeto e adicione as seguintes informações:

```bash
echo 'EMAIL_LOGIN="seu email"' >> .env
echo 'SENHA_LOGIN="sua senha"' >> .env
```


<h1 align="center"> Funcionalidades </h1>

## ARQUIVO - general.json
    esse arquivo vc pode colocar o poyload do ticket e usar na api de teste

## API - consulta flash
- yarn api:flash ( esteira ) (ar)

Ex: 
>**yarn api:flash tag 3259822**

## API - login
- yarn api:login ( instancia ) ( ambient )

Ex:
>**yarn api:login porto prod**

## API - consulta jallcard
- yarn api:jall ( esteira ) (ar)

Ex:
>**yarn api:jall cartao 31097**

## API - teste
    arquivo para testar APIs ( coloque sua api dentro da função "exec" e rode esse comando )

Ex:
>**yarn api:test**

## API  - form template

    essa api gera um arquivo chamado ( resultado.json ) com o form template selecionado ( somente alias do RA - porto)

- yarn api:template ( alias )

Ex:
>**yarn api:template teste-desenvolvimento**

## API -  token

    essa api gera um token criptografado do tipo basic ou bearer

- yarn api:token ( tipo ) ( userName ) ( password )

Ex:
>**yarn api:token bearer testename 12324**

## API - importCsv

    essa api é para encerrar ou tabular ticket em massa

- **lembrando que para essa api funcionar vc precisar preencher o arquivo csv dentro da pasta csv**

#### no momento a api de tabular esta funcionando apenas na instancia porto

- yarn api (instancia) (ambient) (comando)

Ex:
>**yarn api porto prod encerrar**

- yarn api (instancia) (ambient) (comando) (tabId)

Ex:
>**yarn api porto prod tabular eace9768-0512-46c4-9459-a6522123170**
