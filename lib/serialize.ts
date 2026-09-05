export function deepSerializeTimestamps(value: any): any {
  if (value == null) return value;

  if (typeof value === "object") {
    if (typeof value.toDate === "function") {
      try {
        return value.toDate().toISOString();
      } catch {
        return null;
      }
    }

    if (value instanceof Date) {
      return value.toISOString();
    }

    if (Array.isArray(value)) {
      return value.map((item) => deepSerializeTimestamps(item));
    }

    if (typeof value.get === "function" && typeof value.data === "function") {
      const doc = value as any;
      try {
        const data = doc.data();
        const id = doc.id;
        return {
          id,
          ...deepSerializeTimestamps(data),
        };
      } catch {
        return null;
      }
    }

    const out: Record<string, any> = {};
    for (const key of Object.keys(value)) {
      out[key] = deepSerializeTimestamps(value[key]);
    }
    return out;
  }

  return value;
}

export function serializeSnapshotDocs(snapshot: any) {
  const results: any[] = [];
  snapshot.forEach((doc: any) => {
    results.push({
      id: doc.id,
      ...deepSerializeTimestamps(doc.data()),
    });
  });
  return results;
}
