import React, { createContext, useContext, useReducer } from 'react';
import produce from 'immer';

export type CheckoutDialogContextType = {
  closeCheckoutDialog: () => void;
  openCheckoutDialog: (args: {
    title: CheckoutDialogReducerState['title'];
    action: CheckoutDialogReducerState['action'];
  }) => void;
  title: string;
  action: CheckoutDialogReducerState['action'];
  open: boolean;
};

export type CheckoutDialogReducerState = {
  title: string;
  action: (args: { source: string; ccLast4: string }) => void;
  open: boolean;
};

export type CheckoutDialogContextAction =
  | {
      type: 'openCheckoutDialog';
      title: string;
      action: (args: { source: string; ccLast4: string }) => void;
    }
  | {
      type: 'closeCheckoutDialog';
    };

const checkoutDialogContextInitialState = () => ({
  closeCheckoutDialog: () => {},
  openCheckoutDialog: () => {},
  title: '',
  action: () => {},
  open: false
});
const CheckoutDialogContext = createContext<CheckoutDialogContextType>(
  checkoutDialogContextInitialState()
);

export const useCheckoutDialogContext = () => useContext(CheckoutDialogContext);

const CheckoutDialogReducer: React.Reducer<
  CheckoutDialogReducerState,
  CheckoutDialogContextAction
> = (state, action) => {
  switch (action.type) {
    case 'openCheckoutDialog':
      return produce(state, draft => {
        draft.open = true;
        draft.action = action.action;
        draft.title = action.title;
      });

    case 'closeCheckoutDialog':
      return produce(state, draft => {
        draft.open = false;
        draft.action = () => {};
        draft.title = '';
      });

    default:
      return state;
  }
};

export const CheckoutDialogProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(CheckoutDialogReducer, {
    title: '',
    action: () => {},
    open: false
  });

  const openCheckoutDialog = ({
    title,
    action
  }: {
    title: CheckoutDialogReducerState['title'];
    action: CheckoutDialogReducerState['action'];
  }) => {
    dispatch({ type: 'openCheckoutDialog', title, action });
  };

  const closeCheckoutDialog = () => {
    dispatch({
      type: 'closeCheckoutDialog'
    });
  };
  return (
    <CheckoutDialogContext.Provider
      value={{
        closeCheckoutDialog,
        openCheckoutDialog,
        ...state
      }}
    >
      {children}
    </CheckoutDialogContext.Provider>
  );
};
