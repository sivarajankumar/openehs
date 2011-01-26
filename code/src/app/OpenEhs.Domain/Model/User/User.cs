﻿/*****************************************************************************
 * Project: Open Electronic Healthcare System
 * Group: Ghana Team
 * Date: Jan-12-2011
 * 
 * Author: Cameron Harp (charp5257@gmail.com)
 *****************************************************************************/

namespace OpenEhs.Domain
{
    public class User
    {
        #region Properties

        public virtual int Id { get; private set; }
        public virtual string UserName { get; set; }
        public virtual string Password { get; set; }

        #endregion


        #region Constructor(s)

        public User(int id, string username, string password)
        {
            Id = id;
            UserName = username;
            Password = password;
        }

        #endregion
    }
}