import diaryData from '../../data/entries.json';

import { DiaryEntry } from '../types'

const Diaries: DiaryEntry[] = diaryData

const getEntries = (): DiaryEntry[] => {
  return diaryData;
};

const addDiary = () => {
  return null;
};

export default {
  getEntries,
  addDiary
};