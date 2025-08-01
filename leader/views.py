from django.shortcuts import render, get_object_or_404, redirect
from django.contrib import messages
from .models import *
from .decorators import *


def index(request):
    """Home page view"""
    # newest 5 from each model
    all_links = Links.objects.all()  # order doesn't matter here
    all_courses = Courses.objects.order_by('-id')[:5]
    all_services = Services.objects.order_by('-id')[:5]
    all_testimonials = Testimonials.objects.order_by('-id')[:5]
    all_events = Events.objects.order_by('-id')[:5]
    
    context = {
        'links': all_links,
        'courses': all_courses,
        'services': all_services,
        'testimonials': all_testimonials,
        'events': all_events,
    }
    return render(request, 'index.html', context)
    
def about(request):
    """About page view"""
    
    all_links = Links.objects.all()
    all_information = Information.objects.all()
    all_missions = Missions.objects.all()
    all_history = History.objects.all()
    all_values = Values.objects.all()
    all_achievements = Achievements.objects.all()
    
    context = {
      'links':all_links,
      'information':all_information,
      'missions':all_missions,
      'history':all_history,
      'values':all_values,
      'achievements':all_achievements,
    }
    
    return render(request, 'about.html', context)

def courses(request):
    """Courses page view"""
    all_links = Links.objects.all()
    all_courses = Courses.objects.all()
    
    
    context = {
      'links':all_links,
      'courses':all_courses,
    }
    return render(request, 'courses.html',context)

def courses_id(request,id):
  """ for each course """
  all_links = Links.objects.all()
  course = Courses.objects.get(id=id)
  
  
  context = {
    'links':all_links,
    'course':course
  }
  return render(request,'courses_id.html',context)


def contact(request):
    """Contact page view"""
    
    all_links = Links.objects.all()
    all_address = Address.objects.all()
    all_phone = Phone.objects.all()
    all_email = Email.objects.all()
    all_work_time = WorkTime.objects.all()
    all_map = Map.objects.all()
    
    context = {
      'links':all_links,
      'address':all_address,
      'phone':all_phone,
      'email':all_email,
      'worktime':all_work_time,
      'map':all_map,
    }
    
    return render(request, 'contact.html', context)

def teachers(request):
  """ for teachers page """
  
  all_links = Links.objects.all()
  all_teachers = Teachers.objects.all()
  
  context = {
    'links':all_links,
    'teachers':all_teachers,
  }
  
  return render(request, 'teachers.html')

def enroll(request):
    """ enroll page view """
    
    all_info = Information.objects.all()
    all_classname = ClassName.objects.all()
    
    context = {
      'information':all_info,
      'classname':all_classname,
    }
    
    
    if request.method == "POST":
        try:
            student_name = request.POST.get('student_name')
            date_of_birth = request.POST.get('date_of_birth')
            gender = request.POST.get('gender')
            enroll_class = request.POST.get('class')
            father_name = request.POST.get('father_name')
            mother_name = request.POST.get('mother_name')
            phone = request.POST.get('phone')
            e_mail = request.POST.get('email')
            address = request.POST.get('address')
            additional_info = request.POST.get('additional_info')
            
            EnrollRequest.objects.create(
                student_name=student_name,
                date_of_birth=date_of_birth,
                gender=gender,
                enroll_class=enroll_class,
                father_name=father_name,
                mother_name=mother_name,
                phone=phone,
                e_mail=e_mail,
                address=address,
                additional_info=additional_info,
            )
            
            messages.success(request, f'Enrollment request for {student_name} has been submitted successfully!')
            return redirect('enroll')  # Redirect to prevent resubmission
            
        except:
            messages.error(request, 'An error occurred while processing your enrollment request. Please try again.')
    
    return render(request, 'enroll.html', context)


@admin_required
def show_enroll_requests(request):
    if request.method == "POST":
        enroll_id = request.POST.get('enroll_id')
        enroll = get_object_or_404(EnrollRequest, id=enroll_id)
        enroll.status = False
        enroll.save()
        return redirect('enroll-requests') # Refresh page to reflect update

    all_links = Links.objects.all()
    all_enroll_request = EnrollRequest.objects.all()
    all_classname = ClassName.objects.all()

    context = {
        'links':all_links,
        'show_footer': False,
        'enroll_requests': all_enroll_request,
        'classname':all_classname,
    }

    return render(request, 'enroll_requests.html', context)

def notice(request):
    if request.method == 'POST' and 'delete_notice' in request.POST:
        if request.user.is_authenticated and request.user.groups.filter(name='admin').exists():
            notice_id = request.POST.get('notice_id')
            notice_to_delete = get_object_or_404(Notice, id=notice_id)
            notice_to_delete.delete()
            return redirect('notice')  # Assuming 'notice' is your URL name
    
    all_notices = Notice.objects.all()
    
    context = {
        "notices": all_notices,
    }
    
    return render(request, 'notice.html', context)