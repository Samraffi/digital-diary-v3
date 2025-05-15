import { createAsyncThunk } from '@reduxjs/toolkit'
import type { AppDispatch, RootState } from '@/lib/redux/store'
import { setNoble, setLoading, setError } from './nobleSlice'
import { saveNoble, syncNobleState } from '@/lib/db'
import type { Noble } from '../types'

// Initialize noble state
export const initializeNoble = createAsyncThunk<
  Noble | null,
  string,
  { dispatch: AppDispatch; state: RootState }
>(
  'noble/initialize',
  async (name, { dispatch }) => {
    dispatch(setLoading(true))
    try {
      const noble = await syncNobleState(name)
      if (noble) {
        dispatch(setNoble(noble))
        return noble
      } else {
        dispatch(setError('Failed to initialize noble'))
        return null
      }
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : 'Unknown error'))
      return null
    } finally {
      dispatch(setLoading(false))
    }
  }
)

// Save noble state
export const saveNobleState = createAsyncThunk<
  boolean,
  void,
  { state: RootState; dispatch: AppDispatch }
>(
  'noble/save',
  async (_, { getState }) => {
    const { noble } = getState().noble
    if (noble) {
      await saveNoble(noble)
      return true
    }
    return false
  }
)

// Add experience to noble
export const addExperience = createAsyncThunk<
  Noble | null,
  number,
  { state: RootState; dispatch: AppDispatch }
>(
  'noble/addExperience',
  async (amount, { getState, dispatch }) => {
    const { noble } = getState().noble
    if (noble) {
      const updatedNoble = {
        ...noble,
        experience: noble.experience + amount
      }
      dispatch(setNoble(updatedNoble))
      await saveNoble(updatedNoble)
      return updatedNoble
    }
    return null
  }
)

// Add resources to noble
export const addResources = createAsyncThunk<
  Noble | null,
  { gold?: number; influence?: number },
  { state: RootState; dispatch: AppDispatch }
>(
  'noble/addResources',
  async (resources, { getState, dispatch }) => {
    const { noble } = getState().noble
    if (noble) {
      const updatedNoble = {
        ...noble,
        resources: {
          gold: noble.resources.gold + (resources.gold || 0),
          influence: noble.resources.influence + (resources.influence || 0)
        }
      }
      dispatch(setNoble(updatedNoble))
      await saveNoble(updatedNoble)
      return updatedNoble
    }
    return null
  }
)

export const addSpecialEffect = createAsyncThunk<
  Noble | null,
  string,
  { state: RootState; dispatch: AppDispatch }
>(
  'noble/addSpecialEffect',
  async (effect, { getState, dispatch }) => {
    const { noble } = getState().noble
    if (noble) {
      const updatedNoble = {
        ...noble,
        stats: {
          ...noble.stats,
          specialEffects: {
            ...noble.stats.specialEffects,
            [effect]: (noble.stats.specialEffects[effect] || 0) + 1
          }
        }
      }
      dispatch(setNoble(updatedNoble))
      await saveNoble(updatedNoble)
      return updatedNoble
    }
    return null
  }
)

// Complete achievement
export const completeAchievement = createAsyncThunk<
  Noble | null,
  string,
  { state: RootState; dispatch: AppDispatch }
>(
  'noble/completeAchievement',
  async (achievementId, { getState, dispatch }) => {
    const { noble } = getState().noble
    if (noble) {
      const updatedAchievements = {
        ...noble.achievements,
        completed: [...noble.achievements.completed, achievementId],
        total: noble.achievements.total + 1
      }
      const updatedNoble = {
        ...noble,
        achievements: updatedAchievements
      }
      dispatch(setNoble(updatedNoble))
      await saveNoble(updatedNoble)
      return updatedNoble
    }
    return null
  }
)