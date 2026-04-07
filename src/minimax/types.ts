export type ChatRole = "system" | "user" | "assistant";

export type ChatMessage = {
  role: ChatRole;
  content: string;
  name?: string;
};

export type ChatCompletionRequest = {
  model: string;
  messages: ChatMessage[];
  stream?: boolean;
  max_completion_tokens?: number;
  temperature?: number;
  top_p?: number;
};

export type ChatCompletionResponse = {
  id?: string;
  model?: string;
  choices?: Array<{
    finish_reason?: string;
    index?: number;
    message?: { role?: string; content: string };
  }>;
  usage?: { total_tokens?: number; prompt_tokens?: number; completion_tokens?: number };
  input_sensitive?: boolean;
  output_sensitive?: boolean;
  input_sensitive_type?: number;
  output_sensitive_type?: number;
  base_resp?: { status_code: number; status_msg: string };
};
