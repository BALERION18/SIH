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
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { toast } = useToast();

  const unreadCount = notificationList.filter(n => !n.read).length;

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!buttonRef.current) return;
    
    const rect = buttonRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setIsDragging(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
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

  const handleMarkAsRead = (notificationId: number) => {
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

  const handleDelete = (notificationId: number) => {
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
      {/* Draggable Floating Notification Button */}
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
          className="w-14 h-14 rounded-full relative select-none bg-yellow-500 hover:bg-yellow-400 text-white shadow-lg border border-yellow-400"
        >
          <Bell className="w-6 h-6" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0 flex items-center justify-center bg-destructive text-destructive-foreground text-xs">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Notification Panel */}
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
          <Card className="bg-gradient-glass backdrop-blur-xl border border-white/20 shadow-glass">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Bell className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Notifications</span>
                  <Badge variant="secondary" className="text-xs">
                    {notificationList.length}
                  </Badge>
                </div>
                <div className="flex items-center space-x-1">
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleMarkAllAsRead}
                      className="text-xs h-6 px-2"
                    >
                      Mark all read
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="h-6 w-6"
                  >
                    <X className="w-3 h-3" />
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
                      className={`p-3 rounded-lg border transition-colors ${
                        notification.urgent 
                          ? 'bg-primary/10 border-primary/20' 
                          : 'bg-white/5 border-white/10'
                      } ${
                        !notification.read ? 'bg-opacity-80' : 'opacity-60'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="text-sm font-medium truncate">{notification.title}</h4>
                            {notification.urgent && (
                              <Badge variant="destructive" className="text-xs flex-shrink-0">
                                Urgent
                              </Badge>
                            )}
                            {!notification.read && (
                              <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
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
                      <div className="flex items-center justify-end space-x-1 mt-2">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="h-6 px-2 text-xs"
                          >
                            <Check className="w-3 h-3 mr-1" />
                            Read
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(notification.id)}
                          className="h-6 px-2 text-xs text-destructive hover:text-destructive"
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