import API from "./axios";
import type { Group } from "../types/index";

export const getGroups = (params?: Record<string, string>) =>
    API.get('/groups', { params })

export const getGroup = (id: string) =>
    API.get(`/groups/${id}`)

export const createGroup = (groupData: Omit<Group, '_id' | 'members' | 'createdAt' | 'updatedAt'>) =>
    API.post('/groups', groupData)

export const joinGroup = (id: string, quantity: number) =>
    API.post(`/groups/${id}/join`, { quantity })

export const updateGroup = (id: string, groupData: Partial<Omit<Group, '_id' | 'members' | 'createdAt' | 'updatedAt'>>) =>
    API.patch(`/groups/${id}`, groupData)