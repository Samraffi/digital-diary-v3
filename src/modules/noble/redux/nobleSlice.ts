import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import type { Noble } from '../types'
import type { AppDispatch } from '@/lib/redux/store'
import { syncNobleState } from '@/lib/db'

interface NobleState {
  noble: Noble | null
  isLoading: boolean
  error: string | null
}

const initialState: NobleState = {
  noble: null,
  isLoading: false,
  error: null
}

const nobleSlice = createSlice({
  name: 'noble',
  initialState,
  reducers: {
    setNoble: (state, action: PayloadAction<Noble | null>) => {
      state.noble = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    }
  }
})

export const { setNoble, setLoading, setError } = nobleSlice.actions

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
      }
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      dispatch(setLoading(false))
    }
  }
)
export default nobleSlice.reducer