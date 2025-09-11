import { supabase } from '../lib/supabase'

export const createNotification = async (
  userId: string,
  type: string,
  message: string,
  link?: string
) => {
  const { error } = await supabase
    .from('notifications')
    .insert({
      user_id: userId,
      type,
      message,
      link,
    })

  if (error) {
    console.error('Error creating notification:', error)
  }
}
