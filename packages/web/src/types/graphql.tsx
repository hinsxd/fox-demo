/* eslint-disable */
import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';
export type Maybe<T> = T | null;

/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string,
  String: string,
  Boolean: boolean,
  Int: number,
  Float: number,
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any,
};


export type Lesson = {
   __typename?: 'Lesson',
  id: Scalars['ID'],
  start: Scalars['DateTime'],
  end: Scalars['DateTime'],
  comment: Scalars['String'],
  teacher: Teacher,
  numberOfPeople?: Maybe<Scalars['Float']>,
  student?: Maybe<Student>,
};

/** Lesson Status */
export enum LessonStatus {
  Hidden = 'Hidden',
  DisplayOnly = 'DisplayOnly',
  Bookable = 'Bookable',
  Booked = 'Booked',
  Cancelled = 'Cancelled'
}

export type Mutation = {
   __typename?: 'Mutation',
  addLesson: Scalars['Boolean'],
  editLesson: Lesson,
  setComment: Lesson,
  deleteLesson: Scalars['String'],
  addStudent: Student,
  editStudent: Student,
  addTeacher: Teacher,
  deleteTeacher: Scalars['Boolean'],
  updateTeacher: Teacher,
  logout: Scalars['Boolean'],
  login: User,
};


export type MutationAddLessonArgs = {
  teacherId: Scalars['ID'],
  start: Scalars['DateTime'],
  end: Scalars['DateTime'],
  comment?: Maybe<Scalars['String']>,
  status?: Maybe<LessonStatus>,
  repeatWeeks: Scalars['Int']
};


export type MutationEditLessonArgs = {
  id: Scalars['ID'],
  studentId?: Maybe<Scalars['ID']>,
  teacherId: Scalars['ID'],
  start: Scalars['DateTime'],
  end: Scalars['DateTime'],
  comment: Scalars['String'],
  status: LessonStatus
};


export type MutationSetCommentArgs = {
  id: Scalars['ID'],
  comment: Scalars['String']
};


export type MutationDeleteLessonArgs = {
  id: Scalars['ID'],
  cancelReason?: Maybe<Scalars['String']>
};


export type MutationAddStudentArgs = {
  name: Scalars['String'],
  phone?: Maybe<Scalars['String']>,
  emergencyName?: Maybe<Scalars['String']>,
  emergencyRelation?: Maybe<Scalars['String']>,
  emergencyPhone?: Maybe<Scalars['String']>,
  detailedAddress?: Maybe<Scalars['String']>
};


export type MutationEditStudentArgs = {
  id: Scalars['ID'],
  name?: Maybe<Scalars['String']>,
  phone?: Maybe<Scalars['String']>,
  emergencyName?: Maybe<Scalars['String']>,
  emergencyRelation?: Maybe<Scalars['String']>,
  emergencyPhone?: Maybe<Scalars['String']>,
  detailedAddress?: Maybe<Scalars['String']>
};


export type MutationAddTeacherArgs = {
  name: Scalars['String'],
  hourPrice: Scalars['Int']
};


export type MutationDeleteTeacherArgs = {
  id: Scalars['ID']
};


export type MutationUpdateTeacherArgs = {
  id: Scalars['ID'],
  name: Scalars['String'],
  hourPrice: Scalars['Int'],
  color: Scalars['String']
};


export type MutationLoginArgs = {
  username: Scalars['String'],
  password: Scalars['String']
};

export type Query = {
   __typename?: 'Query',
  lessons: Array<Lesson>,
  students: Array<Student>,
  student: Student,
  teachers: Array<Teacher>,
  me?: Maybe<User>,
  user: User,
  users: Array<User>,
};


export type QueryStudentArgs = {
  id: Scalars['ID']
};


export type QueryUserArgs = {
  id: Scalars['ID']
};

export type Student = {
   __typename?: 'Student',
  id: Scalars['ID'],
  name: Scalars['String'],
  phone: Scalars['String'],
  emergencyName: Scalars['String'],
  emergencyRelation: Scalars['String'],
  emergencyPhone: Scalars['String'],
  detailedAddress: Scalars['String'],
  bookedLessons: Array<Lesson>,
};

export type Teacher = {
   __typename?: 'Teacher',
  id: Scalars['ID'],
  name: Scalars['String'],
  lessons?: Maybe<Array<Lesson>>,
  hourPrice: Scalars['Float'],
  color: Scalars['String'],
};

export type User = {
   __typename?: 'User',
  id: Scalars['ID'],
  email: Scalars['String'],
  role: UserRole,
  username?: Maybe<Scalars['String']>,
};

/** User Roles */
export enum UserRole {
  Admin = 'Admin',
  User = 'User',
  NewUser = 'NewUser'
}

export type LessonFragmentFragment = (
  { __typename?: 'Lesson' }
  & Pick<Lesson, 'id' | 'start' | 'end' | 'comment' | 'numberOfPeople'>
  & { teacher: (
    { __typename?: 'Teacher' }
    & TeacherFragmentFragment
  ), student: Maybe<(
    { __typename?: 'Student' }
    & Pick<Student, 'id' | 'name' | 'phone' | 'emergencyName' | 'emergencyRelation' | 'emergencyPhone'>
  )> }
);

export type AddLessonMutationVariables = {
  teacherId: Scalars['ID'],
  start: Scalars['DateTime'],
  end: Scalars['DateTime'],
  repeatWeeks: Scalars['Int'],
  status: LessonStatus
};


export type AddLessonMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'addLesson'>
);

export type DeleteLessonMutationVariables = {
  id: Scalars['ID'],
  cancelReason?: Maybe<Scalars['String']>
};


export type DeleteLessonMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deleteLesson'>
);

export type EditLessonMutationVariables = {
  id: Scalars['ID'],
  studentId?: Maybe<Scalars['ID']>,
  teacherId: Scalars['ID'],
  start: Scalars['DateTime'],
  end: Scalars['DateTime'],
  comment: Scalars['String'],
  status: LessonStatus
};


export type EditLessonMutation = (
  { __typename?: 'Mutation' }
  & { editLesson: (
    { __typename?: 'Lesson' }
    & LessonFragmentFragment
  ) }
);

export type SetCommentMutationVariables = {
  id: Scalars['ID'],
  comment: Scalars['String']
};


export type SetCommentMutation = (
  { __typename?: 'Mutation' }
  & { setComment: (
    { __typename?: 'Lesson' }
    & LessonFragmentFragment
  ) }
);

export type LessonsQueryVariables = {};


export type LessonsQuery = (
  { __typename?: 'Query' }
  & { lessons: Array<(
    { __typename?: 'Lesson' }
    & LessonFragmentFragment
  )> }
);

export type TeacherFragmentFragment = (
  { __typename?: 'Teacher' }
  & Pick<Teacher, 'id' | 'name' | 'hourPrice' | 'color'>
);

export type AddTeacherMutationVariables = {
  name: Scalars['String'],
  hourPrice: Scalars['Int']
};


export type AddTeacherMutation = (
  { __typename?: 'Mutation' }
  & { addTeacher: (
    { __typename?: 'Teacher' }
    & TeacherFragmentFragment
  ) }
);

export type DeleteTeacherMutationVariables = {
  id: Scalars['ID']
};


export type DeleteTeacherMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deleteTeacher'>
);

export type UpdateTeacherMutationVariables = {
  id: Scalars['ID'],
  name: Scalars['String'],
  hourPrice: Scalars['Int'],
  color: Scalars['String']
};


export type UpdateTeacherMutation = (
  { __typename?: 'Mutation' }
  & { updateTeacher: (
    { __typename?: 'Teacher' }
    & TeacherFragmentFragment
  ) }
);

export type TeachersQueryVariables = {};


export type TeachersQuery = (
  { __typename?: 'Query' }
  & { teachers: Array<(
    { __typename?: 'Teacher' }
    & TeacherFragmentFragment
  )> }
);

export type UserFragmentFragment = (
  { __typename?: 'User' }
  & Pick<User, 'id' | 'role' | 'email' | 'username'>
);

export type LoginMutationVariables = {
  username: Scalars['String'],
  password: Scalars['String']
};


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { login: (
    { __typename?: 'User' }
    & UserFragmentFragment
  ) }
);

export type LogoutMutationVariables = {};


export type LogoutMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'logout'>
);

export type MeQueryVariables = {};


export type MeQuery = (
  { __typename?: 'Query' }
  & { me: Maybe<(
    { __typename?: 'User' }
    & UserFragmentFragment
  )> }
);

export type UserQueryVariables = {
  id: Scalars['ID']
};


export type UserQuery = (
  { __typename?: 'Query' }
  & { user: (
    { __typename?: 'User' }
    & UserFragmentFragment
  ) }
);

export type UsersQueryVariables = {};


export type UsersQuery = (
  { __typename?: 'Query' }
  & { users: Array<(
    { __typename?: 'User' }
    & UserFragmentFragment
  )> }
);

export const TeacherFragmentFragmentDoc = gql`
    fragment teacherFragment on Teacher {
  id
  name
  hourPrice
  color
}
    `;
export const LessonFragmentFragmentDoc = gql`
    fragment lessonFragment on Lesson {
  id
  teacher {
    ...teacherFragment
  }
  start
  end
  comment
  student {
    id
    name
    phone
    emergencyName
    emergencyRelation
    emergencyPhone
  }
  numberOfPeople
}
    ${TeacherFragmentFragmentDoc}`;
export const UserFragmentFragmentDoc = gql`
    fragment userFragment on User {
  id
  role
  email
  username
}
    `;
export const AddLessonDocument = gql`
    mutation AddLesson($teacherId: ID!, $start: DateTime!, $end: DateTime!, $repeatWeeks: Int!, $status: LessonStatus!) {
  addLesson(teacherId: $teacherId, start: $start, end: $end, repeatWeeks: $repeatWeeks, status: $status)
}
    `;
export type AddLessonMutationFn = ApolloReactCommon.MutationFunction<AddLessonMutation, AddLessonMutationVariables>;

/**
 * __useAddLessonMutation__
 *
 * To run a mutation, you first call `useAddLessonMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddLessonMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addLessonMutation, { data, loading, error }] = useAddLessonMutation({
 *   variables: {
 *      teacherId: // value for 'teacherId'
 *      start: // value for 'start'
 *      end: // value for 'end'
 *      repeatWeeks: // value for 'repeatWeeks'
 *      status: // value for 'status'
 *   },
 * });
 */
export function useAddLessonMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<AddLessonMutation, AddLessonMutationVariables>) {
        return ApolloReactHooks.useMutation<AddLessonMutation, AddLessonMutationVariables>(AddLessonDocument, baseOptions);
      }
export type AddLessonMutationHookResult = ReturnType<typeof useAddLessonMutation>;
export type AddLessonMutationResult = ApolloReactCommon.MutationResult<AddLessonMutation>;
export type AddLessonMutationOptions = ApolloReactCommon.BaseMutationOptions<AddLessonMutation, AddLessonMutationVariables>;
export const DeleteLessonDocument = gql`
    mutation DeleteLesson($id: ID!, $cancelReason: String) {
  deleteLesson(id: $id, cancelReason: $cancelReason)
}
    `;
export type DeleteLessonMutationFn = ApolloReactCommon.MutationFunction<DeleteLessonMutation, DeleteLessonMutationVariables>;

/**
 * __useDeleteLessonMutation__
 *
 * To run a mutation, you first call `useDeleteLessonMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteLessonMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteLessonMutation, { data, loading, error }] = useDeleteLessonMutation({
 *   variables: {
 *      id: // value for 'id'
 *      cancelReason: // value for 'cancelReason'
 *   },
 * });
 */
export function useDeleteLessonMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteLessonMutation, DeleteLessonMutationVariables>) {
        return ApolloReactHooks.useMutation<DeleteLessonMutation, DeleteLessonMutationVariables>(DeleteLessonDocument, baseOptions);
      }
export type DeleteLessonMutationHookResult = ReturnType<typeof useDeleteLessonMutation>;
export type DeleteLessonMutationResult = ApolloReactCommon.MutationResult<DeleteLessonMutation>;
export type DeleteLessonMutationOptions = ApolloReactCommon.BaseMutationOptions<DeleteLessonMutation, DeleteLessonMutationVariables>;
export const EditLessonDocument = gql`
    mutation EditLesson($id: ID!, $studentId: ID, $teacherId: ID!, $start: DateTime!, $end: DateTime!, $comment: String!, $status: LessonStatus!) {
  editLesson(id: $id, studentId: $studentId, teacherId: $teacherId, start: $start, end: $end, comment: $comment, status: $status) {
    ...lessonFragment
  }
}
    ${LessonFragmentFragmentDoc}`;
export type EditLessonMutationFn = ApolloReactCommon.MutationFunction<EditLessonMutation, EditLessonMutationVariables>;

/**
 * __useEditLessonMutation__
 *
 * To run a mutation, you first call `useEditLessonMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditLessonMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editLessonMutation, { data, loading, error }] = useEditLessonMutation({
 *   variables: {
 *      id: // value for 'id'
 *      studentId: // value for 'studentId'
 *      teacherId: // value for 'teacherId'
 *      start: // value for 'start'
 *      end: // value for 'end'
 *      comment: // value for 'comment'
 *      status: // value for 'status'
 *   },
 * });
 */
export function useEditLessonMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<EditLessonMutation, EditLessonMutationVariables>) {
        return ApolloReactHooks.useMutation<EditLessonMutation, EditLessonMutationVariables>(EditLessonDocument, baseOptions);
      }
export type EditLessonMutationHookResult = ReturnType<typeof useEditLessonMutation>;
export type EditLessonMutationResult = ApolloReactCommon.MutationResult<EditLessonMutation>;
export type EditLessonMutationOptions = ApolloReactCommon.BaseMutationOptions<EditLessonMutation, EditLessonMutationVariables>;
export const SetCommentDocument = gql`
    mutation SetComment($id: ID!, $comment: String!) {
  setComment(id: $id, comment: $comment) {
    ...lessonFragment
  }
}
    ${LessonFragmentFragmentDoc}`;
export type SetCommentMutationFn = ApolloReactCommon.MutationFunction<SetCommentMutation, SetCommentMutationVariables>;

/**
 * __useSetCommentMutation__
 *
 * To run a mutation, you first call `useSetCommentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetCommentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setCommentMutation, { data, loading, error }] = useSetCommentMutation({
 *   variables: {
 *      id: // value for 'id'
 *      comment: // value for 'comment'
 *   },
 * });
 */
export function useSetCommentMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<SetCommentMutation, SetCommentMutationVariables>) {
        return ApolloReactHooks.useMutation<SetCommentMutation, SetCommentMutationVariables>(SetCommentDocument, baseOptions);
      }
export type SetCommentMutationHookResult = ReturnType<typeof useSetCommentMutation>;
export type SetCommentMutationResult = ApolloReactCommon.MutationResult<SetCommentMutation>;
export type SetCommentMutationOptions = ApolloReactCommon.BaseMutationOptions<SetCommentMutation, SetCommentMutationVariables>;
export const LessonsDocument = gql`
    query Lessons {
  lessons {
    ...lessonFragment
  }
}
    ${LessonFragmentFragmentDoc}`;

/**
 * __useLessonsQuery__
 *
 * To run a query within a React component, call `useLessonsQuery` and pass it any options that fit your needs.
 * When your component renders, `useLessonsQuery` returns an object from Apollo Client that contains loading, error, and data properties 
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLessonsQuery({
 *   variables: {
 *   },
 * });
 */
export function useLessonsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<LessonsQuery, LessonsQueryVariables>) {
        return ApolloReactHooks.useQuery<LessonsQuery, LessonsQueryVariables>(LessonsDocument, baseOptions);
      }
export function useLessonsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<LessonsQuery, LessonsQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<LessonsQuery, LessonsQueryVariables>(LessonsDocument, baseOptions);
        }
export type LessonsQueryHookResult = ReturnType<typeof useLessonsQuery>;
export type LessonsLazyQueryHookResult = ReturnType<typeof useLessonsLazyQuery>;
export type LessonsQueryResult = ApolloReactCommon.QueryResult<LessonsQuery, LessonsQueryVariables>;
export const AddTeacherDocument = gql`
    mutation AddTeacher($name: String!, $hourPrice: Int!) {
  addTeacher(name: $name, hourPrice: $hourPrice) {
    ...teacherFragment
  }
}
    ${TeacherFragmentFragmentDoc}`;
export type AddTeacherMutationFn = ApolloReactCommon.MutationFunction<AddTeacherMutation, AddTeacherMutationVariables>;

/**
 * __useAddTeacherMutation__
 *
 * To run a mutation, you first call `useAddTeacherMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddTeacherMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addTeacherMutation, { data, loading, error }] = useAddTeacherMutation({
 *   variables: {
 *      name: // value for 'name'
 *      hourPrice: // value for 'hourPrice'
 *   },
 * });
 */
export function useAddTeacherMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<AddTeacherMutation, AddTeacherMutationVariables>) {
        return ApolloReactHooks.useMutation<AddTeacherMutation, AddTeacherMutationVariables>(AddTeacherDocument, baseOptions);
      }
export type AddTeacherMutationHookResult = ReturnType<typeof useAddTeacherMutation>;
export type AddTeacherMutationResult = ApolloReactCommon.MutationResult<AddTeacherMutation>;
export type AddTeacherMutationOptions = ApolloReactCommon.BaseMutationOptions<AddTeacherMutation, AddTeacherMutationVariables>;
export const DeleteTeacherDocument = gql`
    mutation DeleteTeacher($id: ID!) {
  deleteTeacher(id: $id)
}
    `;
export type DeleteTeacherMutationFn = ApolloReactCommon.MutationFunction<DeleteTeacherMutation, DeleteTeacherMutationVariables>;

/**
 * __useDeleteTeacherMutation__
 *
 * To run a mutation, you first call `useDeleteTeacherMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteTeacherMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteTeacherMutation, { data, loading, error }] = useDeleteTeacherMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteTeacherMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteTeacherMutation, DeleteTeacherMutationVariables>) {
        return ApolloReactHooks.useMutation<DeleteTeacherMutation, DeleteTeacherMutationVariables>(DeleteTeacherDocument, baseOptions);
      }
export type DeleteTeacherMutationHookResult = ReturnType<typeof useDeleteTeacherMutation>;
export type DeleteTeacherMutationResult = ApolloReactCommon.MutationResult<DeleteTeacherMutation>;
export type DeleteTeacherMutationOptions = ApolloReactCommon.BaseMutationOptions<DeleteTeacherMutation, DeleteTeacherMutationVariables>;
export const UpdateTeacherDocument = gql`
    mutation UpdateTeacher($id: ID!, $name: String!, $hourPrice: Int!, $color: String!) {
  updateTeacher(id: $id, name: $name, hourPrice: $hourPrice, color: $color) {
    ...teacherFragment
  }
}
    ${TeacherFragmentFragmentDoc}`;
export type UpdateTeacherMutationFn = ApolloReactCommon.MutationFunction<UpdateTeacherMutation, UpdateTeacherMutationVariables>;

/**
 * __useUpdateTeacherMutation__
 *
 * To run a mutation, you first call `useUpdateTeacherMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateTeacherMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateTeacherMutation, { data, loading, error }] = useUpdateTeacherMutation({
 *   variables: {
 *      id: // value for 'id'
 *      name: // value for 'name'
 *      hourPrice: // value for 'hourPrice'
 *      color: // value for 'color'
 *   },
 * });
 */
export function useUpdateTeacherMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateTeacherMutation, UpdateTeacherMutationVariables>) {
        return ApolloReactHooks.useMutation<UpdateTeacherMutation, UpdateTeacherMutationVariables>(UpdateTeacherDocument, baseOptions);
      }
export type UpdateTeacherMutationHookResult = ReturnType<typeof useUpdateTeacherMutation>;
export type UpdateTeacherMutationResult = ApolloReactCommon.MutationResult<UpdateTeacherMutation>;
export type UpdateTeacherMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateTeacherMutation, UpdateTeacherMutationVariables>;
export const TeachersDocument = gql`
    query Teachers {
  teachers {
    ...teacherFragment
  }
}
    ${TeacherFragmentFragmentDoc}`;

/**
 * __useTeachersQuery__
 *
 * To run a query within a React component, call `useTeachersQuery` and pass it any options that fit your needs.
 * When your component renders, `useTeachersQuery` returns an object from Apollo Client that contains loading, error, and data properties 
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTeachersQuery({
 *   variables: {
 *   },
 * });
 */
export function useTeachersQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<TeachersQuery, TeachersQueryVariables>) {
        return ApolloReactHooks.useQuery<TeachersQuery, TeachersQueryVariables>(TeachersDocument, baseOptions);
      }
export function useTeachersLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<TeachersQuery, TeachersQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<TeachersQuery, TeachersQueryVariables>(TeachersDocument, baseOptions);
        }
export type TeachersQueryHookResult = ReturnType<typeof useTeachersQuery>;
export type TeachersLazyQueryHookResult = ReturnType<typeof useTeachersLazyQuery>;
export type TeachersQueryResult = ApolloReactCommon.QueryResult<TeachersQuery, TeachersQueryVariables>;
export const LoginDocument = gql`
    mutation Login($username: String!, $password: String!) {
  login(username: $username, password: $password) {
    ...userFragment
  }
}
    ${UserFragmentFragmentDoc}`;
export type LoginMutationFn = ApolloReactCommon.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      username: // value for 'username'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        return ApolloReactHooks.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, baseOptions);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = ApolloReactCommon.MutationResult<LoginMutation>;
export type LoginMutationOptions = ApolloReactCommon.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;
export type LogoutMutationFn = ApolloReactCommon.MutationFunction<LogoutMutation, LogoutMutationVariables>;

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutation, { data, loading, error }] = useLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<LogoutMutation, LogoutMutationVariables>) {
        return ApolloReactHooks.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument, baseOptions);
      }
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = ApolloReactCommon.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = ApolloReactCommon.BaseMutationOptions<LogoutMutation, LogoutMutationVariables>;
export const MeDocument = gql`
    query Me {
  me {
    ...userFragment
  }
}
    ${UserFragmentFragmentDoc}`;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties 
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<MeQuery, MeQueryVariables>) {
        return ApolloReactHooks.useQuery<MeQuery, MeQueryVariables>(MeDocument, baseOptions);
      }
export function useMeLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, baseOptions);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeQueryResult = ApolloReactCommon.QueryResult<MeQuery, MeQueryVariables>;
export const UserDocument = gql`
    query User($id: ID!) {
  user(id: $id) {
    ...userFragment
  }
}
    ${UserFragmentFragmentDoc}`;

/**
 * __useUserQuery__
 *
 * To run a query within a React component, call `useUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserQuery` returns an object from Apollo Client that contains loading, error, and data properties 
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useUserQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<UserQuery, UserQueryVariables>) {
        return ApolloReactHooks.useQuery<UserQuery, UserQueryVariables>(UserDocument, baseOptions);
      }
export function useUserLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<UserQuery, UserQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<UserQuery, UserQueryVariables>(UserDocument, baseOptions);
        }
export type UserQueryHookResult = ReturnType<typeof useUserQuery>;
export type UserLazyQueryHookResult = ReturnType<typeof useUserLazyQuery>;
export type UserQueryResult = ApolloReactCommon.QueryResult<UserQuery, UserQueryVariables>;
export const UsersDocument = gql`
    query Users {
  users {
    ...userFragment
  }
}
    ${UserFragmentFragmentDoc}`;

/**
 * __useUsersQuery__
 *
 * To run a query within a React component, call `useUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties 
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUsersQuery({
 *   variables: {
 *   },
 * });
 */
export function useUsersQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<UsersQuery, UsersQueryVariables>) {
        return ApolloReactHooks.useQuery<UsersQuery, UsersQueryVariables>(UsersDocument, baseOptions);
      }
export function useUsersLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<UsersQuery, UsersQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<UsersQuery, UsersQueryVariables>(UsersDocument, baseOptions);
        }
export type UsersQueryHookResult = ReturnType<typeof useUsersQuery>;
export type UsersLazyQueryHookResult = ReturnType<typeof useUsersLazyQuery>;
export type UsersQueryResult = ApolloReactCommon.QueryResult<UsersQuery, UsersQueryVariables>;