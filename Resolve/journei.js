const axios = require("axios");
const json = require("./general.json");
const [, , slug, ambient] = process.argv;
//apiTransactionPayer

async function apiTest() {
  try {
    const protocolLogistica = data.result.protocolLogistica;
    const journei = data.result.journei;
    const createdAt = data.result.createdAt;

    const tabs = {
      cartaoEntregue: [
        "89b57444-97ea-4fdf-ab01-99756cba1f7f",
        "51a88093-1ed9-4f1e-b2db-1a49c54f9ff5",
      ],
      cartaoEmAndamento: [
        "3829c757-b6ab-42f1-95c4-c007cf37ed20",
        "cc779134-482d-4025-94ad-6e0a01071e94",
        "fd0b6dd1-9d8c-459e-bfc6-2a9fcb60ba31",
        "bfe7596e-c880-4565-9ad6-f8370a0380cc",
        "dbff4dfc-f80d-4780-82d7-a94b94652e92",
        "ef876997-0649-4927-82a4-41ef5422a65a",
        "ae60cc00-fc0c-4337-9369-4735b2a6834c",
        "0f3c2531-a080-4c55-9bd6-3bc6f52c6cbd",
        "86168fd2-0278-45cc-9d2d-13700952583e",
        "c2aa357d-90bf-4c99-a2ff-b98a7fe5983a",
        "50bebc23-7608-460f-af53-feb4b63e84d5",
        "c31c7d81-9dc6-4cbf-b6f7-1998e0ef7d89",
        "7de68976-e1ae-42a1-8e0c-533a7eba13d5", //nao expedido emb
        "cdd6ef37-b85f-49b3-b606-053445f5cd0a",
        "3eb3b03b-b3b2-4600-9347-bf3b6c8ddafe",
        "944d7c67-33ca-4dd7-be01-530b3a166c1f",
        "b73a6fdc-2c33-4ceb-b750-6fbb35a59bd2",
        "da6f5a97-5a94-4ebd-b3f4-c256f410b8c8",
        "6a2f3141-a208-4691-aa1a-a53848822c39",
        "1e0c2bf1-d785-4f2d-b1d9-c2bc46285dbe",
        "ad99bf65-05d0-4263-bbb5-f96bae498914",
        "b326084b-2d09-4d61-b505-1386715a75e0",
        "89e9871d-b8de-4c4f-b773-f4e4eaae0fd1",
        "69731d0b-3b14-49d6-ad77-5ff8b6719c17",
        "068069b4-2394-421e-9175-c5b6ffdd4095",
        "883b838b-3195-4144-abbe-4baf143d3c08", //nao expedido cartao
      ],
      cartaoNaoEntregue: [
        "b2fc9e49-8340-46e2-b433-f495658dac97",
        "01a7514f-8960-43ef-8edf-e50d9b136a81",
        "df16a50a-df53-4c3d-8e30-e9cbf3cde9cf",
        "c1d16be0-dc08-4217-919e-94b58e63f6e4",
        "96155c4e-7bec-47a9-914b-892ee1214d12",
        "aa490668-0311-46ac-ab0e-5358d8f224ee",
        "1eb1a73c-a5a7-42bf-b2f9-014c226c4e25",
        "9aca5762-91d5-4351-a965-9d0d6671afd3",
      ],
      tagEntregue: [
        "5b020662-fc02-4e2f-bbf5-0f0ef9735722",
        "bd5d6ea4-03a4-45f4-bd55-38a00a1a7187",
        "82149265-b0e3-44ba-9b9c-fe1e2487213b", //teste
      ],
      tagEmAndamento: [
        "ab3b4bc3-2181-48a4-b454-18384105c66c",
        "c52bf8f1-92db-4f83-8c46-acfa1505aa0a",
        "db5f0c85-0c8c-4b3e-8974-c54942fae3a5",
        "e6b2dacb-8043-456f-ab9b-5002c2d375f5",
        "131f4254-e104-4f54-bbe4-358617a8324c",
        "65462280-f25a-416d-90fe-0477395aab85",
        "85ad358b-921d-4b60-965c-f148df29f02f",
        "c3bcd249-dd4f-4f49-87a5-22754ebdbeda",
        "77bb1f49-1235-468b-a375-ee871e20c76a",
        "acaecb19-05d3-40ed-9f3a-8cc5515c652a",
      ],
      tagNaoEntregue: [
        "65462280-f25a-416d-90fe-0477395aab85",
        "e7336577-6e2b-412c-a703-1e036badaea9",
        "9ef439d5-e57c-446e-918c-724d0f13b74e",
        "c51090ab-5660-49bb-9647-ed3df12d1d24",
        "0d020fd7-1bea-49ff-8aa6-50328e5fab1f",
        "707c2aa6-00b9-4e69-9cee-8b0aade1e733",
      ],
    };

    const filtroJournei = journei.map((dados) => {
      return {
        tabName: dados.tabName,
        tabId: dados.tabId,
        date: dados.date,
        skillId: dados.skillId,
        conversationTabId: dados.conversationTabId,
      };
    });

    const ordered_atTab = filtroJournei.sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });

    const tabid = ordered_atTab[0].tabId;
    const currentJournei = ordered_atTab[0];

    let status = "sem status";

    for (var k in tabs) {
      if (tabs[k].includes(tabid)) {
        status = k;
        break;
      }
    }

    if (status === "sem status") {
      console.log({ error: "Valor não encontrado" });
    }

    return {
      currentJournei,
      protocolLogistica,
      status,
      createdAt,
    };
  } catch (error) {
    throw new Error("Error filtering journei");
  }
}

apiTest();
