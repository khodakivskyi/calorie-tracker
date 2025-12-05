import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAppDispatch, useAppSelector} from '../store';
import {updateProfileRequest, clearSettingsMessages} from '../store/slices/profileSlice.ts';
import {graphqlRequest} from '../config/graphqlClient';
import {logout} from '../store/slices/authSlice';
import CalorieGoalModal from '../components/CalorieGoalModal';

export default function ProfilePage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const {user} = useAppSelector(state => state.auth);
    const {loading, error, success} = useAppSelector(state => state.profile);

    const [name, setName] = useState(user?.name || '');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [isCalorieModalOpen, setIsCalorieModalOpen] = useState(false);

    useEffect(() => {
        if (user?.name) {
            setName(user.name);
        }
    }, [user]);

    useEffect(() => {
        return () => {
            dispatch(clearSettingsMessages());
        };
    }, [dispatch]);

    const handleUpdateProfile = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        dispatch(updateProfileRequest(name || null, null));
    };

    const handleChangePassword = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            return;
        }

        if (newPassword.length < 6) {
            return;
        }

        dispatch(updateProfileRequest(null, newPassword));
        setNewPassword('');
        setConfirmPassword('');
    };

    const handleLogout = async () => {
        //move to epic
        try {
            await graphqlRequest<{ logout: boolean }>(`
                query {
                    logout
                }
            `);
        } catch {
            //ignore
        } finally {
            dispatch(logout());
            navigate('/login');
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen pb-24 p-4">
                <div className="max-w-2xl mx-auto">
                    <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg shadow-sm">
                        <p className="text-red-700">Please log in to your account</p>
                    </div>
                </div>
            </div>
        );
    }


    return (
        <div className="min-h-screen pb-24">
            <div className="bg-white rounded-2xl shadow-lg p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile Settings</h1>

                {/* Success/Error*/}
                {success && (
                    <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg mb-4">
                        <p className="text-green-700">{success}</p>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-4">
                        <p className="text-red-700">{error}</p>
                    </div>
                )}
                {/* Кнопка для відкриття модалки */}
                <div className="mb-6">
                    <button
                        onClick={() => setIsCalorieModalOpen(true)}
                        className="w-full py-3 px-6 rounded-lg font-semibold text-white bg-green-500 hover:bg-green-600 transition-all duration-200"
                    >
                        Set Daily Calorie Goal
                    </button>
                </div>

                {/* Модалка */}
                <CalorieGoalModal
                    isOpen={isCalorieModalOpen}
                    onClose={() => setIsCalorieModalOpen(false)}
                    currentLimit={2500}
                    onSave={() => {}}
                />
                {/* Profile Section */}
                <div className="mb-8">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Profile Information</h2>

                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={user.email}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                Name
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Your name"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition duration-200"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading || name === user.name}
                            className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-200 ${
                                loading || name === user.name
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-primary-500 to-accent-600 hover:from-primary-600 hover:to-accent-700 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl'
                            }`}
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </form>
                </div>

                {/* Password */}
                <div className="mb-8 border-t border-gray-200 pt-8">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Change Password</h2>

                    <form onSubmit={handleChangePassword} className="space-y-4">
                        <div>
                            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                New Password <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="newPassword"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Minimum 6 characters"
                                minLength={6}
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition duration-200"
                            />
                        </div>

                        <div>
                            <label htmlFor="confirmPassword"
                                   className="block text-sm font-medium text-gray-700 mb-2">
                                Confirm Password <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Repeat new password"
                                minLength={6}
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition duration-200"
                            />
                            {newPassword && confirmPassword && newPassword !== confirmPassword && (
                                <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !newPassword || !confirmPassword || newPassword !== confirmPassword || newPassword.length < 6}
                            className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-200 ${
                                loading || !newPassword || !confirmPassword || newPassword !== confirmPassword || newPassword.length < 6
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-primary-500 to-accent-600 hover:from-primary-600 hover:to-accent-700 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl'
                            }`}
                        >
                            {loading ? 'Changing password...' : 'Change Password'}
                        </button>
                    </form>
                </div>

                {/* Security */}
                <div className="border-t border-gray-200 pt-8">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Security</h2>

                    <button
                        onClick={handleLogout}
                        className="w-full py-3 px-6 rounded-lg font-semibold text-white bg-red-500 hover:bg-red-600 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                    >
                        Log Out
                    </button>
                </div>
            </div>
        </div>
    );
}

