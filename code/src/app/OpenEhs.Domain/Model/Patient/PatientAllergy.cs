﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace OpenEhs.Domain.Model.Patient
{
    public class PatientAllergy : IEntity
    {
        #region Fields

        public virtual int Id { get; private set; }
        public virtual int Patient { get; set; }
        public virtual int Allergy { get; set; }

        #endregion
    }
}
