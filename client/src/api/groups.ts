import API from "./axios";
import type { CreateGroupData } from "../types";

export const getGroups = (params?: Record<string, string>) =>
    API.get('/groups', { params })

export const getGroup = (id: string) =>
    API.get(`/groups/${id}`)

export const createGroup = (groupData: CreateGroupData) =>
    API.post('/groups', groupData)

export const joinGroup = (id: string, quantity: number) =>
    API.post(`/groups/${id}/join`, { quantity })

export const updateGroup = (id: string, groupData: Partial<CreateGroupData>) =>
    API.patch(`/groups/${id}`, groupData)