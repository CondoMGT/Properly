// types.ts

export interface AllUser {
  id: string;
  name: string;
  avatar: string | null;
  unread: number;
}

export interface MessageSent {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  status: MessageStatus;
  isStarred: boolean;
  readBySender: boolean;
  readByReceiver: boolean;
  attachments?: Attachment[];
}

export interface MessageReceived {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  status: MessageStatus;
  isStarred: boolean;
  readBySender: boolean;
  readByReceiver: boolean;
  attachments: { id: string; attachments: string[] } | null;
}

export interface UserLoggedInEvent {
  userId: string;
}

export interface Attachment {
  id: string;
  type: "file" | "image" | "link";
  url: string;
  name: string;
  preview?: string;
}

export interface MessageAttachment {
  type: string;
  url: string;
  name: string;
}

export interface CloudAttachment {
  id: string;
  type: string;
  name: string;
  buffer: Uint8Array<ArrayBuffer>;
}

export interface MessageGroup {
  date: string;
  messages: MessageReceived[];
}

export interface CloudAttachment {
  id: string;
  // name: File;
  name: string;
  type: string;
  buffer: Uint8Array<ArrayBuffer>;
}
export interface MessageServer {
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string | Date;
  status: MessageStatus;
  attachments?: CloudAttachment[];
}

export interface CloudinaryUploadResult {
  secure_url: string;
}
