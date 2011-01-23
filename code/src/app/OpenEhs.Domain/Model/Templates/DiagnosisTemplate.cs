﻿/*****************************************************************************
 * Project: Open Electronic Healthcare System
 * Group: Ghana Team
 * Date: 23-Jan-2011
 * 
 * Author: Matthew Kimber (matthew.kimber@gmail.com)
 *****************************************************************************/

namespace OpenEhs.Domain
{
    public class DiagnosisTemplate : ITemplate
    {
        public int Id { get; private set; }
        public string Body { get; set; }
        public bool IsActive { get; set; }
    }
}
