import moment from 'moment';

export const getDayName = (date: string): string => {
    const dayNames = {
        Sunday: 'الأحد',
        Monday: 'الاثنين',
        Tuesday: 'الثلاثاء',
        Wednesday: 'الأربعاء',
        Thursday: 'الخميس',
        Friday: 'الجمعة',
        Saturday: 'السبت'
    };
    const day = moment(date).format('dddd');
    return dayNames[day as keyof typeof dayNames] || day;
};