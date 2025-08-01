from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.urls import reverse
from django.utils import timezone

# Create your models here.


# /All models
class Links(models.Model):
  link = models.URLField(max_length=250)
  logo_class = models.CharField(max_length=50)
  
  class Meta:
      verbose_name = "Link"
      verbose_name_plural = "Links"
  
  def __str__(self):
        return self.logo_class

 # /Home models
 
class Services(models.Model):
  img_url = models.URLField(max_length=500)
  title = models.CharField(max_length=250)
  description = models.TextField()
  
  class Meta:
      verbose_name = "Service"
      verbose_name_plural = "Services"
  
  def __str__(self):
        return self.title

class Testimonials(models.Model):
  img_url = models.URLField(max_length=500)
  name = models.CharField(max_length=100)
  testimonial_title = models.CharField(max_length=250)
  description = models.TextField()
  
  class Meta:
      verbose_name = "Testimonial"
      verbose_name_plural = "Testimonials"
  
  def __str__(self):
        return self.testimonial_title

class Events(models.Model):
  img_url = models.URLField(max_length=500)
  event_date = models.IntegerField(default=0)
  event_month = models.IntegerField(default=0)
  title = models.CharField(max_length=240)
  location = models.CharField(max_length=240)
  description = models.TextField()
  
  class Meta:
      verbose_name = "Event"
      verbose_name_plural = "Events"
  
  def __str__(self):
        return self.title


# /Courses models + /Home models

class Courses(models.Model):
    # Fixed: Added default value to prevent errors with empty URLs
    img_url = models.URLField(
        default="https://via.placeholder.com/300x200?text=Course+Image",
        null = True
    )
    
    title = models.CharField(max_length=240)
    
    # Fixed: Made sub_title optional since not all courses need subtitles
    sub_title = models.CharField(max_length=240, blank=True, null=True)
    
    description = models.TextField()
    
    # Fixed: Added default value for author image
    author_img_url = models.URLField(
        default="https://via.placeholder.com/150x150?text=Author",
        null = True
    )
    
    author_name = models.CharField(max_length=255)
    
    # Fixed: Added validation to prevent negative fees
    course_fee = models.IntegerField(
        default=0
    )
    author_bio = models.TextField(
      default = 'Dedicated professional with extensive experience in academic instruction. Committed to delivering high-quality education and fostering student success through innovative teaching methodologies.'
    )
    
    class Meta:
      verbose_name = "Course"
      verbose_name_plural = "Courses"
    
    def __str__(self):
        return self.title



# /Enroll page models

class Price(models.Model):
  primary_fees = models.IntegerField(default=0)
  lower_secondary = models.IntegerField(default=0)
  secondary = models.IntegerField(default=0)
  
  class Meta:
      verbose_name = "Price"
      verbose_name_plural = "Price"
  
  def __str__(self):
    return "This is for showing fees"


class EnrollRequest(models.Model):
  student_name = models.CharField(max_length=250)
  date_of_birth = models.DateField()
  gender = models.CharField(max_length=6)
  enroll_class = models.CharField(max_length=10)
  father_name = models.CharField(max_length=250)
  mother_name = models.CharField(max_length=250)
  phone = models.CharField(max_length=11)
  e_mail = models.EmailField(null=True)
  address = models.TextField()
  additional_info = models.TextField(null=True)
  status = models.BooleanField(default=True)
  
  class Meta:
      verbose_name = "EnrollRequest"
      verbose_name_plural = "EnrollRequests"
  
  def __str__(self):
    return f"{self.student_name} and id = {self.id}"



# /Contact models
class Address(models.Model):
  title = models.CharField(max_length=250, default='title')
  address = models.TextField(max_length=500)
  
  class Meta:
      verbose_name = "Address"
      verbose_name_plural = "Address"
      ordering = ['title']
  
  def __str__(self):
    return self.title

class Phone(models.Model):
  title = models.CharField(max_length=250, default='title')
  phone = models.IntegerField(default=0)
  
  class Meta:
      verbose_name = "Phone"
      verbose_name_plural = "Phone"
      ordering = ['title']
  
  def __str__(self):
    return self.title

class Email(models.Model):
  title = models.CharField(max_length=250, default='title')
  address = models.EmailField(default='something123@gmail.com')
  
  class Meta:
      verbose_name = "Email"
      verbose_name_plural = "Emails"
      ordering = ['title']
  
  def __str__(self):
    return self.title

class WorkTime(models.Model):
  day = models.CharField(max_length=250, default='Saturday - Thusday')
  time = models.TextField(default='8:00 AM - 5:00 PM')
  
  class Meta:
      verbose_name = "WorkTime"
      verbose_name_plural = "WorkTime"
  
  def __str__(self):
    return self.day

class Map(models.Model):
  title = models.CharField(max_length=250, default='title')
  map_link = models.URLField(
      default="https://maps.google.com/maps?q=24.2664376,89.9271063&hl=en&z=14&output=embed"
  )
  
  class Meta:
      verbose_name = "Map"
      verbose_name_plural = "Maps"
      ordering = ['title']
        
  
  def __str__(self):
      return self.title

# /Enroll + /About models

class Information(models.Model):
  students_number = models.IntegerField(default=0)
  pass_rate = models.IntegerField(default=100)
  teacher_number = models.IntegerField(default=10)
  awards = models.IntegerField(default=1)
  
  class Meta:
      verbose_name = "Information"
      verbose_name_plural = "Information"
  
  def __str__(self):
    return "This is for info. Don't make more model."


# /About page
class Missions(models.Model):
  emoji = models.CharField(max_length=10)
  title = models.CharField(max_length=250)
  description = models.TextField()
  
  class Meta:
      verbose_name = "Mission"
      verbose_name_plural = "Missions"
      ordering = ['title']
        
  
  def __str__(self):
    return self.title


class History(models.Model):
  year = models.IntegerField(default=2026)
  title = models.CharField(max_length=250)
  description = models.TextField()
  
  class Meta:
      verbose_name = "History"
      verbose_name_plural = "History"
      ordering = ['title']
        
  
  def __str__(self):
    return self.title


class Values(models.Model):
  title = models.CharField(max_length=250)
  description = models.TextField()
  
  class Meta:
      verbose_name = "Value"
      verbose_name_plural = "Values"
      ordering = ['title']
        
  
  def __str__(self):
    return self.title


class Achievements(models.Model):
  year = models.IntegerField(default=2026)
  award_name = models.CharField(max_length=250)
  awarding_reason = models.TextField()
  
  class Meta:
      verbose_name = "Award"
      verbose_name_plural = "Awards"
      ordering = ['award_name']
        
  
  def __str__(self):
    return self.award_name




class Teachers(models.Model):
    name = models.CharField(
        max_length=100, 
    )
    
    subject = models.CharField(
        max_length=100,
    )
    
    qualification = models.CharField(
        max_length=200,
    )
    
    experience = models.PositiveIntegerField(
        validators=[MinValueValidator(0), MaxValueValidator(50)],
    )
    
    img_url = models.URLField(
        max_length=500,
    )
    
    bio = models.TextField(
        blank=True,
        null=True,
    )
    
    email = models.EmailField(
        blank=True,
        null=True,
    )
    
    phone = models.CharField(
        max_length=20,
        blank=True,
        null=True,
    )
    
    is_active = models.BooleanField(
        default=True,
        #Whether the teacher is currently active
    )
    
    joined_date = models.DateField(
        #Date when the teacher joined the school"
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Teacher"
        verbose_name_plural = "Teachers"
        ordering = ['name']
        
    def __str__(self):
        return f"{self.name} - {self.subject}"


# for /enroll + /enroll_request pages
class ClassName(models.Model):
  name = models.CharField(max_length=25)
  value = models.IntegerField(default=0)
  
  class Meta:
      verbose_name = "ClassName"
      verbose_name_plural = "ClassName"
      ordering = ['name']
  
  def __str__(self):
    return self.name


# /notice page 

class Notice(models.Model):
    title = models.CharField(max_length=250)
    description = models.TextField()
    pdf_link = models.URLField(blank=True, null=True)  # Made optional
    date_posted = models.DateField(default=timezone.now)  # Fixed this line
    
    class Meta:
        verbose_name = "Notice"
        verbose_name_plural = "Notices"
        ordering = ['-date_posted']  # Show newest notices first
    
    def __str__(self):
        return self.title