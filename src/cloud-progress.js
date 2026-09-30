import { normalizeProgress, mergeProgress } from './progress.js';

// PostgREST filters make each update conditional on the server version.
// If another device writes first, re-read and merge rather than overwrite it.
export async function saveCloudProgress(auth,userId,local,{reset=false,attempts=5}={}){
  const incoming=normalizeProgress(local);
  for(let attempt=0;attempt<attempts;attempt++){
    const remote=await auth.getProgress(userId);
    if(remote && typeof remote.updated_at!=='string')throw new Error('Cloud progress version is missing');
    const candidate=reset?normalizeProgress({...incoming,resetAt:Math.max(incoming.resetAt, (remote?.state?.resetAt||0)+1)}):mergeProgress(incoming,remote?.state);
    const saved=await auth.compareAndSetProgress(userId,candidate,remote?.updated_at??null);
    if(saved)return {...saved,state:normalizeProgress(saved.state)};
  }
  throw new Error('Cloud progress changed repeatedly; retry without discarding local progress');
}
