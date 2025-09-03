import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, X, Calendar, MapPin, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const notifications = [
  {
    id: 1,
    title: "New Virtual Tour Available",
    message: "Tashiding Monastery virtual tour is now live with 4K resolution",
    type: "update",
    time: "2 hours ago",
    unread: true,
  },
  {
    id: 2,
    title: "Losar Festival Starting Soon",
    message: "Join the Tibetan New Year celebrations at Rumtek Monastery",
    type: "event",
    time: "1 day ago",
    unread: true,
  },
  {
    id: 3,
    title: "New Audio Guide Language",
    message: "Lepcha language audio guides are now available for all monasteries",
    type: "feature",
    time: "3 days ago",
    unread: false,
  },
];

export const NotificationPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notificationList, setNotificationList] = useState(notifications);
  const { toast } = useToast();

  const unreadCount = notificationList.filter(n => n.unread).length;

  const handleMarkAsRead = (id) => {
    setNotificationList(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, unread: false }
          : notification
      )
    );
  };

  const handleDeleteNotification = (id) => {
    setNotificationList(prev => prev.filter(n => n.id !== id));
    toast({
      title: "Notification Deleted",
      description: "Notification has been removed",
    });
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "event": return <Calendar className="w-4 h-4" />;
      case "feature": return <Sparkles className="w-4 h-4" />;
      case "update": return <MapPin className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "event": return "bg-primary/10 text-primary";
      case "feature": return "bg-accent/10 text-accent-foreground";
      case "update": return "bg-secondary/10 text-secondary-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  if (!isOpen) {
    return (
      <Button
        variant="glass"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="fixed top-20 right-4 z-40 text-white border-white/20 hover:bg-white/20"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-primary text-white text-xs">
            {unreadCount}
          </Badge>
        )}
      </Button>
    );
  }

  return (
    <Card className="fixed top-20 right-4 z-40 w-80 bg-gradient-glass backdrop-blur-xl border border-white/20 shadow-glass">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-white">Notifications</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="text-white hover:bg-white/20"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        {unreadCount > 0 && (
          <Badge variant="secondary" className="w-fit text-xs">
            {unreadCount} unread
          </Badge>
        )}
      </CardHeader>
      <CardContent className="space-y-3 max-h-96 overflow-y-auto">
        {notificationList.length === 0 ? (
          <div className="text-center py-4 text-white/70">
            No notifications
          </div>
        ) : (
          notificationList.map((notification) => (
            <div
              key={notification.id}
              className={`p-3 rounded-lg border transition-all duration-200 ${
                notification.unread 
                  ? "bg-white/10 border-white/20" 
                  : "bg-white/5 border-white/10"
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Badge className={getTypeColor(notification.type)}>
                    {getTypeIcon(notification.type)}
                  </Badge>
                  {notification.unread && (
                    <div className="w-2 h-2 bg-primary rounded-full" />
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteNotification(notification.id)}
                  className="text-white/60 hover:text-white hover:bg-white/20 h-6 w-6 p-0"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
              <h4 className="font-medium text-white text-sm mb-1">
                {notification.title}
              </h4>
              <p className="text-white/80 text-xs mb-2">
                {notification.message}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-white/60 text-xs">{notification.time}</span>
                {notification.unread && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleMarkAsRead(notification.id)}
                    className="text-white/70 hover:text-white text-xs h-6"
                  >
                    Mark as read
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};