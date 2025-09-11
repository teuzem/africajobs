import React, { useState, useEffect, Fragment } from 'react'
import { useAuth } from '../../context/AuthContext'
import { supabase, Notification } from '../../lib/supabase'
import { BellIcon } from '@heroicons/react/24/outline'
import { Menu, Transition } from '@headlessui/react'
import { Link } from 'react-router-dom'
import { formatTimeAgo } from '../../utils/formatters'

export function Notifications() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (user) {
      fetchNotifications()
      
      const channel = supabase
        .channel('realtime-notifications')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` },
          (payload) => {
            setNotifications(prev => [payload.new as Notification, ...prev])
            setUnreadCount(prev => prev + 1)
          }
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    }
  }, [user])

  const fetchNotifications = async () => {
    if (!user) return
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10)
    
    if (data) {
      setNotifications(data)
      setUnreadCount(data.filter(n => !n.is_read).length)
    }
  }

  const markAllAsRead = async () => {
    if (!user) return
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user.id)
      .eq('is_read', false)
    
    if (!error) {
      setUnreadCount(0)
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
    }
  }

  return (
    <Menu as="div" className="relative">
      <Menu.Button className="relative p-2 text-gray-400 hover:text-gray-500">
        <BellIcon className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
        )}
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-80 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="p-2">
            <div className="flex justify-between items-center px-2 py-1">
              <h3 className="font-semibold">Notifications</h3>
              {unreadCount > 0 && (
                <button onClick={markAllAsRead} className="text-sm text-blue-600 hover:underline">
                  Marquer comme lu
                </button>
              )}
            </div>
            <div className="mt-2 max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="text-center py-4 text-gray-500">Aucune notification</div>
              ) : (
                notifications.map(n => (
                  <Menu.Item key={n.id}>
                    {({ active }) => (
                      <Link
                        to={n.link || '#'}
                        className={`${active ? 'bg-gray-100' : ''} block rounded-md p-2 text-sm text-gray-700`}
                      >
                        <div className="flex items-start space-x-2">
                          {!n.is_read && <div className="mt-1.5 h-2 w-2 rounded-full bg-blue-500"></div>}
                          <div className="flex-1">
                            <p className={n.is_read ? 'text-gray-600' : 'font-medium text-gray-900'}>{n.message}</p>
                            <p className="text-xs text-gray-400 mt-1">{formatTimeAgo(n.created_at)}</p>
                          </div>
                        </div>
                      </Link>
                    )}
                  </Menu.Item>
                ))
              )}
            </div>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}
