import React from "react";
import { Bell, X, Check, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";

const notifications = [
  {
    id: 1,
    title: "Losar Festival Tomorrow",
    message: "Don't miss the Tibetan New Year celebration at Rumtek Monastery",
    time: "2 hours ago",
    type: "festival",
    urgent: true,
    read: false,
  },
  {
    id: 2,
    title: "New Virtual Tour Available",
    message: "Explore the newly digitized Enchey Monastery archives",
    time: "1 day ago",
    type: "update",
    urgent: false,
    read: false,
  },
];

export const NotificationPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notificationList, setNotificationList] = useState(notifications);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const buttonRef = useRef(null);
  const { toast } = useToast();

  const unreadCount = notificationList.filter(n => !n.read).length;

  const handleMouseDown = (e) => {
    if (!buttonRef.current) return;
    
    const rect = buttonRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;
    
    // Keep within viewport bounds
    const maxX = window.innerWidth - 56; // button width
    const maxY = window.innerHeight - 56; // button height
    
    setPosition({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY))
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Add global mouse event listeners
  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  const handleMarkAsRead = (notificationId) => {
    setNotificationList(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
    toast({
      title: "Marked as read",
      description: "Notification marked as read",
    });
  };

  const handleDelete = (notificationId) => {
    setNotificationList(prev => 
      prev.filter(notification => notification.id !== notificationId)
    );
    toast({
      title: "Notification deleted",
      description: "Notification has been removed",
    });
  };

  const handleMarkAllAsRead = () => {
    setNotificationList(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    toast({
      title: "All notifications read",
      description: "All notifications marked as read",
    });
  };

  return (
    <>
      {/* Enhanced Draggable Floating Notification Button with Better Contrast */}
      <div 
        className="fixed z-50"
        style={{
          left: position.x || 'auto',
          top: position.y || '50%',
          right: position.x ? 'auto' : '1rem',
          transform: position.x ? 'none' : 'translateY(-50%)',
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
      >
        <Button
          ref={buttonRef}
          onMouseDown={handleMouseDown}
          onClick={(e) => {
            if (!isDragging) {
              setIsOpen(!isOpen);
            }
          }}
          size="icon"
          className="w-14 h-14 rounded-full relative select-none bg-gradient-to-br from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-glow border-2 border-primary-glow/30 transition-all duration-300"
        >
          <Bell className="w-6 h-6" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0 flex items-center justify-center bg-destructive text-destructive-foreground text-xs font-bold border-2 border-white dark:border-background">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Enhanced Notification Panel with Better Visibility */}
      {isOpen && (
        <div 
          className="fixed z-40 w-80"
          style={{
            left: position.x ? position.x + 80 : 'auto',
            top: position.y ? position.y : '50%',
            right: position.x ? 'auto' : '5rem',
            transform: position.x ? 'none' : 'translateY(-50%)'
          }}
        >
          <Card className="bg-gradient-glass backdrop-blur-xl border-2 border-white/30 shadow-glass">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Bell className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">Notifications</span>
                  <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border border-primary/20">
                    {notificationList.length}
                  </Badge>
                </div>
                <div className="flex items-center space-x-1">
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleMarkAllAsRead}
                      className="text-xs h-8 px-3 hover:bg-primary/10 text-primary"
                    >
                      Mark all read
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="h-8 w-8 hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {notificationList.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No notifications</p>
                  </div>
                ) : (
                  notificationList.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-lg border transition-all duration-200 ${
                        notification.urgent 
                          ? 'bg-destructive/10 border-destructive/30 shadow-glow' 
                          : 'bg-card/50 border-border/50 backdrop-blur-sm'
                      } ${
                        !notification.read ? 'ring-2 ring-primary/20' : 'opacity-75'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="text-sm font-medium truncate text-foreground">{notification.title}</h4>
                            {notification.urgent && (
                              <Badge variant="destructive" className="text-xs flex-shrink-0 animate-pulse">
                                Urgent
                              </Badge>
                            )}
                            {!notification.read && (
                              <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 animate-pulse" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                            {notification.message}
                          </p>
                          <span className="text-xs text-muted-foreground">
                            {notification.time}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-end space-x-1 mt-3">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="h-7 px-3 text-xs hover:bg-primary/10 text-primary"
                          >
                            <Check className="w-3 h-3 mr-1" />
                            Read
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(notification.id)}
                          className="h-7 px-3 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};
