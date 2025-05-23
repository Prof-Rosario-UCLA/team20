// utils/cache.js

const fetch_expiration = 10 * 60 * 1000;
const scholars_expiration = 20 * 60 * 1000;

const storeDataInCache = (key, value) => {
  const data = {
    payload: value,
    storedAt: Date.now()
  };
  localStorage.setItem(key, JSON.stringify(data));
};

const retrieveDataFromCache = (key, time) => {
  const item = localStorage.getItem(key);
  
  if (!item) return null;
  
  const { payload, storedAt } = JSON.parse(item);
  
  if (Date.now() - storedAt > time) {
    localStorage.removeItem(key);
    return null;
  }
  
  return payload;
};

export const cacheFetch = (query, results) => {
  const storageKey = `query_${query.toLowerCase().trim()}`;
  storeDataInCache(storageKey, results);
};

export const getFetchCache = (query) => {
  const storageKey = `query_${query.toLowerCase().trim()}`;
  return retrieveDataFromCache(storageKey, fetch_expiration);
};

export const cacheScholars = (scholarId, scholarData) => {
  const storageKey = `scholar_${scholarId}`;
  storeDataInCache(storageKey, scholarData);
};

export const getScholarsCache = (scholarId) => {
  const storageKey = `scholar_${scholarId}`;
  return retrieveDataFromCache(storageKey, scholars_expiration);
};