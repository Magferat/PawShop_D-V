import { useEffect, useState } from "react";
import { useGetMyAppointmentsQuery, useSaveGoogleEventIdMutation } from "../../redux/api/appointmentApiSlice";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { gapi } from "gapi-script"; 
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);
const CLIENT_ID = "625191253281-fsva1cg7me3vg8hhi66e5glgddk8vupj.apps.googleusercontent.com"; // 👈 Replace with yours
const SCOPES = "https://www.googleapis.com/auth/calendar.events";



const CalendarPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [saveGoogleEventId] = useSaveGoogleEventIdMutation();
  const navigate = useNavigate();
  const { data: userAppointments, isLoading } = useGetMyAppointmentsQuery();

  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: CLIENT_ID,
        scope: SCOPES,
      });
    }
    gapi.load("client:auth2", start);
  }, []);

  useEffect(() => {
    if (userAppointments) {
      setAppointments(
        userAppointments.map((appt) => {
          const [hour, minute] = appt.timeSlot.split(":").map(Number);
          const start = new Date(appt.date);
          start.setHours(hour, minute, 0, 0);
          const end = new Date(start.getTime() + (appt.packageDuration || 0) * 60000);
  
          return {
            id: appt._id,
            title: `${appt.service.name}`,
            start,
            end,
            service: appt.service,
            packageId: appt.packageId,
            googleEventId: appt.googleEventId, 
          };
        })
      );
    }
  }, [userAppointments]);

  const syncWithGoogleCalendar = () => {
    gapi.auth2.getAuthInstance().signIn().then(() => {
      gapi.client.load('calendar', 'v3').then(() => {
        appointments
          .filter((event) => !event.googleEventId)  // Skip already synced events
          .forEach(async (event) => {
            const eventObj = {
              summary: event.title,
              description: `Service: ${event.service.name}`,
              start: {
                dateTime: event.start.toISOString(),
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
              },
              end: {
                dateTime: event.end.toISOString(),
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
              },
            };
  
            try {
              const response = await gapi.client.calendar.events.insert({
                calendarId: 'primary',
                resource: eventObj,
              });
  
              console.log('Event created:', response);
  
              const googleEventId = response.result.id;
  
              // Save to backend
              try {
                await saveGoogleEventId({
                  appointmentId: event.id,
                  googleEventId,
                }).unwrap();
  
                console.log(`Google Event ID saved for appointment ${event.id}`);
                setAppointments((prev) =>
                  prev.map((appt) =>
                    appt.id === event.id ? { ...appt, googleEventId } : appt   //u pdates the local appointments state by adding the googleEventId to the specific appointment that was just synced with Google Calendar
                  )
                );                
              } catch (saveErr) {
                console.error(`Failed to save Google Event ID for appointment ${event.id}:`, saveErr);
              }
            } catch (err) {
              console.error('Error creating event:', err);
            }
          });
      });
    });
  };
  
  

  // Custom event component
  const EventComponent = ({ event }) => (
    <div className="flex justify-between items-center">
      <span>{event.title}</span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/appointments/${event.id}`);
        }}
        className="ml-2 px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Details
      </button>
    </div>
  );

  if (isLoading) return <p>Loading calendar...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Appointments</h1>
        <button
          onClick={syncWithGoogleCalendar}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Sync to Google Calendar
        </button>
      </div>
      <Calendar
        localizer={localizer}
        events={appointments}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        components={{
          event: EventComponent,
        }}
      />
    </div>
  );
};

export default CalendarPage;
