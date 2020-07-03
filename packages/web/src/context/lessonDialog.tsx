import React, { createContext, useContext, useReducer } from 'react';
import produce from 'immer';
import { LessonsQuery } from 'types/graphql';

type LessonType = LessonsQuery['lessons'][number];

export type LessonDialogAction =
  | {
      type: 'openLessonDialog';
      lesson: LessonType;
    }
  | {
      type: 'closeLessonDialog';
    };

const lessonDialogReducerInitialState = () => ({
  open: false,
  lesson: null as null | LessonType
});

const lessonDialogInitialState = () => ({
  open: false,
  openDialog: (lesson: LessonType) => {},
  closeDialog: () => {},
  lesson: null as null | LessonType
});

export type LessonDialogContextType = ReturnType<
  typeof lessonDialogInitialState
>;
export type LessonDialogReducerState = ReturnType<
  typeof lessonDialogReducerInitialState
>;
const LessonDialogContext = createContext<LessonDialogContextType>(
  lessonDialogInitialState()
);

export const useLessonDialogContext = () => useContext(LessonDialogContext);

const LessonDialogReducer: React.Reducer<
  LessonDialogReducerState,
  LessonDialogAction
> = (state, action) => {
  switch (action.type) {
    case 'openLessonDialog':
      return produce(state, draft => {
        draft.open = true;
        draft.lesson = action.lesson;
      });

    case 'closeLessonDialog':
      return produce(state, draft => {
        draft.open = false;
      });

    default:
      return state;
  }
};

export const LessonDialogProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(
    LessonDialogReducer,
    lessonDialogReducerInitialState()
  );

  const openDialog = (lesson: LessonType) => {
    dispatch({ type: 'openLessonDialog', lesson });
  };

  const closeDialog = () => {
    dispatch({ type: 'closeLessonDialog' });
  };
  return (
    <LessonDialogContext.Provider value={{ openDialog, closeDialog, ...state }}>
      {children}
    </LessonDialogContext.Provider>
  );
};
