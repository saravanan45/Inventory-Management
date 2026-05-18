const { getOrderById } = require("./OrdersService");

const getChatReply = async (message, history) => {
  try {
    const messages = [
      ...history,
      {
        role: "user",
        content: message,
      },
    ];
    const response = await fetch("http://localhost:11434/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "qwen3",
        messages,
        stream: false,
        tools: [
          {
            type: "function",

            function: {
              name: "getOrderById",

              description: "Get details of an order using order id",

              parameters: {
                type: "object",

                properties: {
                  orderId: {
                    type: "string",
                    description: "Order ID",
                  },
                },

                required: ["orderId"],
              },
            },
          },
        ],
      }),
    });
    const data = await response.json();
    const toolCalls = data.message.tool_calls || [];
    console.log("Received tool calls from ollama:", JSON.stringify(toolCalls));
    if (toolCalls?.length) {
      const toolCall = toolCalls[0];
      const functionName = toolCall.function.name;
      const args = toolCall.function.arguments;
      let result;
      if (functionName === "getOrderById") {
        const orderId = args.orderId;
        result = await getOrderById(orderId);
        console.log("Fetched order details for tool call:", result);
      }
      messages.push(data.message);
      messages.push({
        role: "tool",
        content: JSON.stringify(result),
      });
    }

    const finalResponse = await fetch("http://localhost:11434/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "qwen3",
        messages,
        stream: false,
      }),
    });
    const finalData = await finalResponse.json();

    console.log("Received chat reply from ollama:", finalData.message.content);
    return finalData.message.content;
  } catch (error) {
    console.error("Error fetching chat reply:", error);
    throw new Error("Error fetching chat reply");
  }
};

module.exports = {
  getChatReply,
};
