// types.ts

export enum UserRole {
  MANAGER = "MANAGER",
  TENANT = "TENANT",
}

export enum MessageStatus {
  SENT = "SENT",
  DELIVERED = "DELIVERED",
  READ = "READ",
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export interface Tenant {
  id: number;
  propertyManagerId: number;
}

export interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  content: string;
  timestamp: Date;
  status: MessageStatus;
}

export interface Notification {
  id: number;
  userId: number;
  messageId: number;
  isRead: boolean;
  createdAt: Date;
}
