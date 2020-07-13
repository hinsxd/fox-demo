import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Grid, makeStyles } from '@material-ui/core';
import { isEqual } from 'date-fns';
import React, { createContext, useState } from 'react';
import { LessonFragmentFragment, useLessonsQuery } from 'types/graphql';
import AddLessonDialog from './AddLessonDialog';
import Dashboard from './Dashboard';
import EditLessonDialog from './EditLessonDialog';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  input: {
    margin: theme.spacing(1),
    width: '100%',
    minWidth: 120,
  },
}));

type AddLessonDialogState = {
  mode: 'add' | 'edit' | 'close';
  start: Date | null;
  end: Date | null;
  lesson: LessonFragmentFragment | null;
};

const initialLessonDialogState: AddLessonDialogState = {
  mode: 'close',
  start: null,
  end: null,
  lesson: null,
};

export const DialogContext = createContext(initialLessonDialogState);

const Overview: React.FC = () => {
  const [calendarState, setCalendarState] = useState({
    start: new Date(),
    end: new Date(),
  });

  // const [selectedTeachers, setSelectedTeachers] = React.useState<string[]>([]);

  // const handleToggleTeacher = (value: string) => () => {
  //   const currentIndex = selectedTeachers.indexOf(value);
  //   const newChecked = [...selectedTeachers];

  //   if (currentIndex === -1) {
  //     newChecked.push(value);
  //   } else {
  //     newChecked.splice(currentIndex, 1);
  //   }

  //   setSelectedTeachers(newChecked);
  // };

  const [lessonDialogState, setLessonDialogState] = useState(
    initialLessonDialogState
  );
  // Styles
  const classes = useStyles();

  const { data, refetch } = useLessonsQuery({
    variables: {
      ...calendarState,
    },
    fetchPolicy: 'cache-and-network',
  });

  // const { data: teachersData } = useTeachersQuery();

  // const teachers = teachersData?.teachers || [];

  // useEffect(() => {
  //   setSelectedTeachers(teachers.map(({ id }) => id));
  // }, [teachers]);
  const lessons = data?.lessons || [];

  const openAddLessonDialog = (start: Date, end: Date) => {
    setLessonDialogState((state) => ({
      ...state,
      start,
      end,
      mode: 'add',
    }));
  };

  const openEditLessonDialog = (id: string) => {
    const lesson = lessons.find((lesson) => lesson.id === id);
    if (lesson)
      setLessonDialogState((state) => ({
        ...state,
        mode: 'edit',
        lesson,
      }));
  };
  const closeDialog = () => {
    setLessonDialogState(initialLessonDialogState);
  };
  return (
    <Dashboard title="Overview">
      <DialogContext.Provider value={lessonDialogState}>
        <Grid container direction="row">
          <Grid item xs>
            <div className={classes.root}>
              <FullCalendar
                minTime="06:00:00"
                selectable
                selectMirror
                // schedulerLicenseKey="GPL-My-Project-Is-Open-Source"
                height="auto"
                defaultView="timeGridWeek"
                header={{
                  left: 'prev,next today',
                  center: 'title',
                  right:
                    'dayGridMonth,timeGridWeek,timeGridDay,listWeek,listMonth',
                }}
                buttonText={{
                  listWeek: 'Week List',
                  listMonth: 'Month List',
                }}
                views={{
                  week: {
                    columnHeaderFormat: {
                      month: 'short',
                      day: '2-digit',
                    },
                  },
                }}
                plugins={[
                  timeGridPlugin,
                  dayGridPlugin,
                  listPlugin,
                  interactionPlugin,
                ]}
                events={lessons.map(
                  ({
                    id,
                    teacher: { name: title },
                    student,
                    start,
                    end,
                    numberOfPeople,
                  }) => ({
                    id,
                    title: `${title}${
                      student?.name ? ' - ' + student.name : ''
                    }`,
                    start,
                    end,
                    backgroundColor: 'yellow',
                    textColor: 'black',
                  })
                )}
                timeZone="local"
                timeZoneParam="Asia/Hong_Kong"
                datesRender={async ({ view }) => {
                  if (
                    !isEqual(calendarState.start, view.currentStart) ||
                    !isEqual(calendarState.end, view.currentEnd)
                  ) {
                    setCalendarState({
                      start: view.currentStart,
                      end: view.currentEnd,
                    });
                  }
                }}
                select={({ start, end }) => {
                  openAddLessonDialog(start, end);
                }}
                eventClick={({ event: { id } }) => {
                  openEditLessonDialog(id);
                }}
              />
            </div>
          </Grid>
        </Grid>
        <AddLessonDialog onClose={closeDialog} refetch={refetch} />
        <EditLessonDialog onClose={closeDialog} refetch={refetch} />
      </DialogContext.Provider>
    </Dashboard>
  );
};
export default Overview;

// const useS = makeStyles(theme => ({
//   color: {
//     width: '16px',
//     height: '16px',
//     borderRadius: '2px'
//   }
// }));
// const SidebarTeacherRow: React.FC<{
//   teacher: TeacherFragmentFragment;
//   onRowClick: () => void;
//   checked: boolean;
// }> = ({ teacher, onRowClick, checked }) => {
//   const styles = useS();

//   const labelId = `checkbox-list-label-${teacher.id}`;

//   return (
//     <ListItem dense button onClick={onRowClick}>
//       <ListItemIcon>
//         <Checkbox
//           edge="start"
//           checked={checked}
//           tabIndex={-1}
//           disableRipple
//           inputProps={{ 'aria-labelledby': labelId }}
//         />
//       </ListItemIcon>
//       <ListItemText id={labelId} primary={teacher.name} />
//       <ListItemSecondaryAction>
//         <Box className={styles.color} bgcolor={teacher.color} />
//       </ListItemSecondaryAction>
//     </ListItem>
//   );
// };
