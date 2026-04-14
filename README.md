## MQTT: LWT vs Retain Flag

O protocolo MQTT opera fundamentado na separação entre a origem e o destino dos dados. Para solucionar problemas de sincronização e perda de conectividade, o protocolo disponibiliza dois recursos de controle: o **LWT (Last Will and Testament)** e a **Retain Flag**.


### 1. Definições Operacionais

#### **Last Will and Testament (LWT)**
O LWT é uma instrução configurada pelo cliente no momento da abertura da conexão. Trata-se de uma mensagem armazenada pelo servidor que será publicada apenas se a conexão for interrompida de forma inesperada.
* **Mecanismo:** O servidor monitora a atividade do dispositivo. Caso o fluxo de dados seja interrompido sem um comando de encerramento formal, a mensagem de "testamento" é enviada aos tópicos definidos.
* **Objetivo:** Notificar o sistema sobre quedas de energia, falhas de rede ou travamentos do equipamento.

#### **Retain Flag**
A Retain Flag é uma marcação aplicada a uma mensagem de publicação que ordena ao servidor a conservação daquele dado específico.
* **Mecanismo:** Ao receber uma mensagem com esta flag, o servidor substitui qualquer valor anterior armazenado para aquele tópico. Quando um novo cliente se inscreve no tópico, o servidor entrega esta última mensagem guardada de forma imediata.
* **Objetivo:** Garantir que o estado mais recente de um sensor ou variável esteja disponível para qualquer consulta posterior, sem depender de uma nova transmissão.


### 2. Comparativo de Comportamento

| Recurso | Condição para Envio | Persistência no Servidor |
| :--- | :--- | :--- |
| **LWT** | Erro de conexão ou ausência de sinal. | Temporária (dura enquanto a sessão estiver ativa). |
| **Retain Flag** | Nova subscrição de um cliente. | Permanente (até que seja substituída ou apagada). |


### 3. Aplicação em Sistemas IoT

#### **Monitoramento de Disponibilidade (LWT)**
A aplicação do LWT é essencial para a segurança operacional. Se um controlador de carga perde a comunicação, o sistema de supervisão é informado através da publicação automática do status "indisponível". Isso impede que a interface de controle exiba informações estáticas de um dispositivo que já não está mais operando, evitando erros de interpretação por parte dos operadores.

#### **Consistência de Dados (Retain Flag)**
A Retain Flag é utilizada para variáveis que mudam raramente, como configurações de sistema ou estados de relés. Se um painel de monitoramento é ativado após horas de funcionamento do sistema, ele obtém os valores atuais diretamente do servidor. Sem este recurso, o painel permaneceria sem dados até que cada sensor realizasse uma nova transmissão espontânea.


### 4. Gestão e Boas Práticas

* **Procedimento de Limpeza:** Para remover uma mensagem retida do servidor, deve-se publicar um conteúdo vazio (payload zero) no respectivo tópico com a Retain Flag ativada.
* **Encerramento Voluntário:** Em desligamentos programados, o cliente deve publicar seu status de saída antes de fechar a conexão, pois o LWT não é disparado em desconexões efetuadas através do comando padrão de encerramento.
* **Padronização de Tópicos:** Recomenda-se separar tópicos de telemetria (dados contínuos) de tópicos de status (LWT e Retain) para otimizar o processamento das mensagens e a organização do sistema.
