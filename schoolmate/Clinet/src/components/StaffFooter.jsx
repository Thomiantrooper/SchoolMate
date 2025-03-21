import { Footer } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { BsFacebook, BsInstagram, BsTwitter, BsGithub } from 'react-icons/bs';

export default function StaffFooter() {
  return (
    <Footer container className='border border-t-8 border-teal-500'>
      <div className='w-full max-w-7xl mx-auto'>
        <div className='grid w-full justify-between sm:flex md:grid-cols-1'>
          <div className='mt-5'>
            <Link
              to='/student-page'
              className='self-center whitespace-nowrap text-lg sm:text-xl font-semibold dark:text-white'
            >
              <span className="px-3 py-2 bg-gradient-to-r from-blue-600 via-teal-500 to-green-400 rounded-xl text-white font-bold shadow-md transition-transform transform hover:scale-105">
                SchoolMate - Staff
              </span>
            </Link>
          </div>
          <div className='grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3 sm:gap-6'>
            <div>
              <Footer.Title title='Student Resources' />
              <Footer.LinkGroup col>
                <Link to='/courses' className='text-gray-600 dark:text-gray-300 hover:text-teal-500'>
                  Courses
                </Link>
                <Link to='/assignments' className='text-gray-600 dark:text-gray-300 hover:text-teal-500'>
                  Assignments
                </Link>
                <Link to='/community' className='text-gray-600 dark:text-gray-300 hover:text-teal-500'>
                  Staff Community
                </Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title='Help & Support' />
              <Footer.LinkGroup col>
                <Link to='/help-desk' className='text-gray-600 dark:text-gray-300 hover:text-teal-500'>
                  Help Desk
                </Link>
                <Link to='/contact-us' className='text-gray-600 dark:text-gray-300 hover:text-teal-500'>
                  Contact Us
                </Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title='Follow Us' />
              <Footer.LinkGroup col>
                <a href='https://facebook.com' target='_blank' rel='noopener noreferrer' className='text-gray-600 dark:text-gray-300 hover:text-teal-500'>
                  Facebook
                </a>
                <a href='https://instagram.com' target='_blank' rel='noopener noreferrer' className='text-gray-600 dark:text-gray-300 hover:text-teal-500'>
                  Instagram
                </a>
                <a href='https://twitter.com' target='_blank' rel='noopener noreferrer' className='text-gray-600 dark:text-gray-300 hover:text-teal-500'>
                  Twitter
                </a>
                <a href='https://github.com' target='_blank' rel='noopener noreferrer' className='text-gray-600 dark:text-gray-300 hover:text-teal-500'>
                  GitHub
                </a>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>
        <Footer.Divider />
        <div className='w-full sm:flex sm:items-center sm:justify-between'>
          <Footer.Copyright
            href='#'
            by="SecQuantum"
            year={new Date().getFullYear()}
          />
          <div className="flex gap-6 sm:mt-0 mt-4 sm:justify-center">
            <a href='https://facebook.com' target='_blank' rel='noopener noreferrer'>
              <Footer.Icon icon={BsFacebook} />
            </a>
            <a href='https://instagram.com' target='_blank' rel='noopener noreferrer'>
              <Footer.Icon icon={BsInstagram} />
            </a>
            <a href='https://twitter.com' target='_blank' rel='noopener noreferrer'>
              <Footer.Icon icon={BsTwitter} />
            </a>
            <a href='https://github.com' target='_blank' rel='noopener noreferrer'>
              <Footer.Icon icon={BsGithub} />
            </a>
          </div>
        </div>
      </div>
    </Footer>
  );
}
