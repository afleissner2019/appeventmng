import React, { useState, useEffect } from 'react'
import { useHistory, Link } from "react-router-dom"
import styles from './Home.module.css';
import axios from "axios";
import EventView from "./EventView";


function HomeDefault() {


    const [events, setEvents] = useState();
    const [eventsByCity, setEventsByCity] = useState();
    const [eventsByCategory, setEventsByCategory] = useState();

    const history = useHistory();

    // get all Events
    const getAllEvents = async () => {
        try {
            const result = await axios.get('http://localhost:7000/event/viewAll');
            console.log('All Events:')
            console.log(result.data)

            if (result.data !== 0) {
                let myEvents = result.data.map((event) => {
                    // console.log(event);

                    return (
                        <Link to = "/event/viewOneEvent/:id" exact>
                            <div onClick={handleEvent} className={`${styles.events_container} ${styles.event_view}`}>

                                <div className={styles.events_all}>
                                    <img className={styles.events_bg} src={event.event_photo} alt="" />
                                    <p className={styles.events_date}>{event.dateEventstarted}</p>
                                    <p className={styles.events_name_category}>{event.event_name},
                                {event.category_id.map((category) => <>{category.name}</>)}</p>
                                </div>
                            </div>
                        </Link>
                    )
                })
                setEvents(myEvents)
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleEvent = () => {

        history.push("/eventView/")

    }

    // filter all Events by Location/City
    const getAEventsByCity = async () => {
        try {
            const result = await axios.get('http://localhost:7000/event/viewByCity');
            console.log('Events by Location/City:')
            console.log(result.data)

            if (result.data !== 0) {
                let myEvents = result.data.map((event) => {
                    console.log(event);
                    return (
                        <div className={styles.events_container}>

                            <div className={styles.events_by_city}>
                                <img className={styles.events_by_city_bg} src={event.event_photo} alt="" />
                                <p className={styles.location_text}>{event._id.location}</p>
                            </div>
                        </div>
                    )
                })
                setEventsByCity(myEvents)
            }
        } catch (error) {
            console.log(error);
        }
    }

    // filter all Events by Category
    const getAEventsByCategory = async () => {
        try {
            const result = await axios.get('http://localhost:7000/event/viewByCategory');
            console.log('Events by Category:')
            console.log(result.data)
            if (result.data !== 0) {
                let myEvents = result.data.map((event) => {
                    // console.log(event);
                    return (
                        <div className={styles.events_container}>

                            <div className={styles.events_by_category}>
                                <img className={styles.events_by_category_bg} alt={event._id.map((category) => <>{category.photo}</>)} alt="" />
                                <p className={styles.category_text}>{event._id.map((category) => <>{category.name}</>)}</p>
                            </div>
                        </div>
                    )
                })
                setEventsByCategory(myEvents)
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getAllEvents();
        getAEventsByCity()
        getAEventsByCategory()
    }, []);


    return (
        <>
            <div className={styles.upcoming_events}>
                <div className={styles.upcoming_events_head}>
                    <h2> Upcoming Events</h2>
                    <p>See all Events</p>
                </div>

                <div className={styles.upcoming_events_body}>
                    {events}
                </div>
            </div>


            <div className={styles.events_by_city}>
                <div className={styles.events_by_city_head}>
                    <h2> Events by Location</h2>
                    <p>See all Events</p>
                </div>

                <div className={styles.events_by_citys_body}>
                    {eventsByCity}
                </div>
            </div>


            <div className={styles.events_by_Category}>
                <div className={styles.events_by_Category_head}>
                    <h2> Events by Category</h2>
                    <p>See all Events</p>
                </div>

                <div className={styles.events_by_Category_body}>
                    {eventsByCategory}
                </div>
            </div>
        </>
    )
}

export default HomeDefault