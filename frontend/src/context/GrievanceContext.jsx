import { createContext, useState, useEffect, useRef } from "react";

export const GrievanceContext = createContext();

export const GrievanceProvider = ({ children }) => {
  const [grievances, setGrievances] = useState([]);
  const [allGrievances, setAllGrievances] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [activities, setActivities] = useState([]);

  // ✅ FIX: Use email-specific notif keys so each user has their own notifications
  const userEmail = localStorage.getItem("lastLoggedInEmail") || "guest";
  const notifKey = `employeeNotifs_${userEmail}`;
  const notifIdsKey = `notifiedTicketIds_${userEmail}`;

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem(notifKey);
    return saved ? JSON.parse(saved) : [];
  });

  const notifiedIds = useRef(
    new Set(JSON.parse(localStorage.getItem(notifIdsKey) || "[]")),
  );

  // Fetch employee's own grievances
  const fetchGrievances = () => {
    const token = localStorage.getItem("token");
    // ✅ Uses lastLoggedInEmail which is always the real email
    const email = localStorage.getItem("lastLoggedInEmail");
    if (!email) return;

    fetch(`http://localhost:8080/api/grievances/employee/${email}`, {
      headers: { Authorization: "Bearer " + token },
    })
      .then(async (res) => {
        if (!res.ok) return [];
        const text = await res.text();
        if (!text) return [];
        return JSON.parse(text);
      })
      .then((data) => {
        const list = data || [];
        setGrievances(list);

        // Check for newly resolved grievances → create notifications
        const newNotifs = [];
        list.forEach((g) => {
          if (g.status === "Resolved" && !notifiedIds.current.has(g.ticketId)) {
            notifiedIds.current.add(g.ticketId);
            newNotifs.push({
              id: g.ticketId,
              ticketId: g.ticketId,
              title: g.title,
              resolutionNote: g.resolutionNote || null,
              message: `Your grievance "${g.title}" has been resolved.`,
              createdAt: g.resolvedAt || new Date().toISOString(),
              read: false,
              type: "resolved",
            });
          }
        });

        if (newNotifs.length > 0) {
          setNotifications((prev) => {
            const updated = [...newNotifs, ...prev];
            // ✅ FIX: Save under email-specific key
            localStorage.setItem(notifKey, JSON.stringify(updated));
            return updated;
          });
          localStorage.setItem(
            notifIdsKey,
            JSON.stringify([...notifiedIds.current]),
          );
        }
      })
      .catch((err) => {
        console.error("Error fetching grievances:", err);
        setGrievances([]);
      });
  };

  // Fetch ALL grievances (for admin analytics/reports)
  const fetchAllGrievances = () => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:8080/api/grievances", {
      headers: { Authorization: "Bearer " + token },
    })
      .then(async (res) => {
        if (!res.ok) return [];
        const text = await res.text();
        if (!text) return [];
        return JSON.parse(text);
      })
      .then((data) => setAllGrievances(data || []))
      .catch((err) => {
        console.error("Error fetching all grievances:", err);
        setAllGrievances([]);
      });
  };

  useEffect(() => {
    fetchGrievances();
    fetchAllGrievances();
    const interval = setInterval(() => {
      fetchGrievances();
      fetchAllGrievances();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const markAsRead = (ticketId) => {
    setNotifications((prev) => {
      const updated = prev.map((n) =>
        n.ticketId === ticketId || n.id === ticketId ? { ...n, read: true } : n,
      );
      localStorage.setItem(notifKey, JSON.stringify(updated));
      return updated;
    });
  };

  const markAllRead = () => {
    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, read: true }));
      localStorage.setItem(notifKey, JSON.stringify(updated));
      return updated;
    });
  };

  const clearNotifications = () => {
    setNotifications([]);
    localStorage.setItem(notifKey, JSON.stringify([]));
  };

  const addActivity = (message) => {
    setActivities((prev) => [
      { message, time: new Date().toLocaleString() },
      ...prev,
    ]);
  };

  const addNotification = (message) => {
    const n = {
      id: Date.now().toString(),
      message,
      time: new Date().toLocaleString(),
      createdAt: new Date().toISOString(),
      read: false,
      type: "general",
    };
    setNotifications((prev) => {
      const updated = [n, ...prev];
      localStorage.setItem(notifKey, JSON.stringify(updated));
      return updated;
    });
  };

  const updateStatus = (id, status) => {
    setGrievances((prev) =>
      prev.map((g) => (g.id === id ? { ...g, status } : g)),
    );
    addActivity(`Grievance status updated to ${status}`);
    addNotification(`Your grievance status changed to ${status}`);
  };

  const deleteGrievance = (id) => {
    setGrievances((prev) => prev.filter((g) => g.id !== id));
  };

  const addFeedback = (data) => {
    const employeeName = localStorage.getItem("employeeName") || "Employee";
    setFeedbacks((prev) => [
      ...prev,
      {
        id: Date.now(),
        employee: employeeName,
        rating: data.rating,
        message: data.message,
        date: new Date().toLocaleDateString(),
      },
    ]);
  };

  return (
    <GrievanceContext.Provider
      value={{
        grievances,
        allGrievances,
        feedbacks,
        activities,
        notifications,
        updateStatus,
        deleteGrievance,
        addFeedback,
        markAsRead,
        markAllRead,
        clearNotifications,
      }}
    >
      {children}
    </GrievanceContext.Provider>
  );
};
