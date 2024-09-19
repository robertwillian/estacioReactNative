import { synchronize, SyncPullArgs, SyncPullResult, SyncPushArgs, Timestamp } from "@nozbe/watermelondb/sync";
import { database } from "../model"
import { AxiosResponse } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "./api";
import Schedule from "../model/Schedule";
import { Updates } from "expo/config-plugins";

export const syncService = async () => {
  console.log(`[sync] called`);

  await synchronize({
    database,
    pullChanges: async (props: SyncPullArgs) => {
      console.log(`[pullChanges] called`);

      try {
        const result: AxiosResponse = await serviceSyncPullRequest(props.lastPulledAt || null)

        const { data } = result;

        console.log('DATA: ', JSON.stringify(data.changes));
        

        return {
          ...data,
          changes: {
            ...data.changes,
            customers: {
              created: data.changes.customers.created.map((sch: Schedule) => ({
                ...sch,
                created_at: new Date(sch.createdAt as Date).getTime(),
                updated_at: new Date(sch.updatedAt as Date).getTime(),
              })),
              updated: data.changes.customers.updated.map((sch: Schedule) => ({
                ...sch,
                created_at: new Date(sch.createdAt as Date).getTime(),
                updated_at: new Date(sch.updatedAt as Date).getTime(),
              })),
              deleted: data.changes.customers.deleted
            },
            schedules: {
              created: data.changes.schedules.created.map((sch: Schedule) => ({
                ...sch,
                date: new Date(sch.date).getTime(),
                created_at: new Date(sch.createdAt as Date).getTime(),
                updated_at: new Date(sch.updatedAt as Date).getTime(),
                customer_id: sch.customerId
              })),
              updated: data.changes.schedules.updated.map((sch: Schedule) => ({
                ...sch,
                date: new Date(sch.date).getTime(),
                created_at: new Date(sch.createdAt as Date).getTime(),
                updated_at: new Date(sch.updatedAt as Date).getTime(),
                customer_id: sch.customerId
              })),
              deleted: data.changes.schedules.deleted
            }
          }
        };
      }
      catch (err: any) {
        console.log('[pullChanges]', err);

        if (err.response.status === 401 || err.response.status === 403) {
          throw new Error("Problemas com a autenticação");
        }

        throw new Error("Erro ao receber atualizações");
      }
    },
    pushChanges: async (props: SyncPushArgs) => {
      console.log(`[pushChanges] called`);
      console.log(JSON.stringify(props));
      
      

      const dataToPush = {
        changes: {
          ...props.changes,
          schedules: {
            created: props.changes.schedules.created.map(schedule => ({
              ...schedule,
              customerId: schedule.customer_id
            })),
            updated: props.changes.schedules.updated.map(schedule => ({
              ...schedule,
              customerId: schedule.customer_id
            })),
            deleted: props.changes.schedules.deleted
          }
        }
      };
      try {
        console.log('pushChanges', props.changes);
        
        return serviceSyncPushRequest((dataToPush))
          .then(result => {
            
          })
          .catch(err => {
            console.log('[pushChanges]', err);
            throw new Error(err.response.data.message || "Erro inesperado");
          });
      }
      catch (err: any) {
        console.error(err);
        
        console.warn('[pushChanges]', err.response)
        if (err.response.status === 401 || err.response.status === 403) {
          throw new Error("Problemas com autenticação");
        }

        throw new Error("Errro ao enviar atualizações");
      }
    }
  })
}

export const serviceSyncPullRequest = async (timestamp: Timestamp | null) => {

  const token = await AsyncStorage.getItem('token')  

  return api.get<SyncPullResult>(`/sync?lastUpdate=${timestamp || 0}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export const serviceSyncPushRequest = async (props: any) => {
  const token = await AsyncStorage.getItem('token')

  return api.post<SyncPullResult>(`/sync`, props, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}