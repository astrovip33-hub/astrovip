import { getSessionId, supabase, track } from './data';

function hash(input: string) {
  let h = 5381;
  for (let i = 0; i < input.length; i++) h = ((h << 5) + h) ^ input.charCodeAt(i);
  return h >>> 0;
}

export async function initExperiments() {
  try {
    const { data, error } = await supabase
      .from('av_experiments')
      .select('key,target_path,variants,config')
      .eq('status', 'running');
    if (error || !data?.length) return;

    for (const experiment of data as any[]) {
      if (experiment.target_path && !location.pathname.startsWith(experiment.target_path)) continue;
      const variants = Array.isArray(experiment.variants) ? experiment.variants : [];
      if (!variants.length) continue;
      const total = variants.reduce((sum: number, item: any) => sum + Number(item.weight || 0), 0) || 100;
      let cursor = hash(`${experiment.key}:${getSessionId()}`) % total;
      let selected = variants[0];
      for (const variant of variants) {
        cursor -= Number(variant.weight || 0);
        if (cursor < 0) { selected = variant; break; }
      }
      document.documentElement.dataset[`avExp${toDataKey(experiment.key)}`] = String(selected.key || 'control');
      await supabase.from('av_experiment_events').insert({
        experiment_key: experiment.key,
        variant: String(selected.key || 'control'),
        event_name: 'exposure',
        session_id: getSessionId(),
        path: location.pathname,
        metadata: { version: 'v9' }
      });
      track('experiment_exposure', { experiment: experiment.key, variant: selected.key });
    }
  } catch {
    // Experiments are progressive enhancement only.
  }
}

function toDataKey(value: string) {
  return value.replace(/[^a-z0-9]+(.)?/gi, (_, chr) => chr ? chr.toUpperCase() : '').replace(/^./, ch => ch.toUpperCase());
}
