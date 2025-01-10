import { render, screen, fireEvent } from '@testing-library/react';
import ProfileDropdown from '../Pages/Profile';

test('renders the profile dropdown and handles logout', () => {
  render(<ProfileDropdown user={{ name: 'Test User' }} />);
  const profileButton = screen.getByText(/View Profile/i);
  expect(profileButton).toBeInTheDocument();

  fireEvent.click(profileButton);
  const logoutButton = screen.getByText(/Logout/i);
  expect(logoutButton).toBeInTheDocument();
});
