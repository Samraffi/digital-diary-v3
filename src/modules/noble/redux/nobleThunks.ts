import { createAsyncThunk } from '@reduxjs/toolkit'
import type { AppDispatch, RootState } from '@/lib/redux/store'
import { setNoble, setLoading, setError } from './nobleSlice'
import { saveNoble, syncNobleState } from '@/lib/db'
import type { Noble } from '../types'

// Initialize noble state
export const initializeNoble = createAsyncThunk<
  void,
  string,
  { dispatch: AppDispatch }
>(
  'noble/initialize',
  async (name, { dispatch }) => {
    dispatch(setLoading(true))
    try {
      const noble = await syncNobleState(name)
      if (noble) {
        dispatch(setNoble(noble))
      } else {
        dispatch(setError('Failed to initialize noble'))
      }
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      dispatch(setLoading(false))
    }
  }
)

// Save noble state
export const saveNobleState = createAsyncThunk<
  void,
  void,
  { state: RootState }
>(
  'noble/save',
  async (_, { getState }) => {
    const { noble } = getState().noble
    if (noble) {
      await saveNoble(noble)
    }
  }
)

// Add experience to noble
export const addExperience = createAsyncThunk<
  void,
  number,
  { state: RootState }
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
    }
  }
)

// Add resources to noble
export const addResources = createAsyncThunk<
  void,
  { gold?: number; influence?: number },
  { state: RootState }
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
    }
  }
)

// Complete achievement
export const completeAchievement = createAsyncThunk<
  void,
  string,
  { state: RootState }
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
    }
  }
)