export enum BadRequestMessage {
    InValidLoginData = "!اطلاعات ارسال شده برای ورود صحیح نمی باشد",
    InValidRegisterData = "!اطلاعات ارسال شده برای ثبت نام صحیح نمی باشد",
    SomeThingWrong = "خطایی پیش آمده مجددا تلاش کنید",
    InvalidCategories = "دسته بندی ها را به درستی وارد کنید",
    OTPNotExpired = "کد تایید قبلی شما هنوز منقضی نشده است. پس از ۲ دقیقه،‌مجدد تلاش کنید"
}
export enum AuthMessage {
    NotFoundAccount = "!حساب کاربری یافت نشد",
    TryAgain = "دوباره تلاش کنید",
    AlreadyExistAccount = "!حساب کاربری با این مشخصات قبلا وجود دارد",
    ExpiredCode="کد تایید منقصی شده! مجددا تلاش کنید",
    LoginAgain="مجددا وارد حساب کاربری خود شوید",
    LoginIsRequired="وارد حساب کاربری خود شوید",
}
export enum NotFoundMessage {
    NotFound = "!موردی یافت نشد",
    NotFoundCategory = "!دسته بندی یافت نشد",
    NotFoundEvent = "!رویدادی یافت نشد",
    NotFoundUser = "!کاربری یافت نشد",
}
export enum ValidationMessage {
    InvalidPhoneFormat = "!شماره موبایل وارد شده صحیح نمیباشد",
}
export enum PublicMessage {
    SentOtp = "کد یکبار مصرف با موفقیت ارسال شد",
    LoggedIn = "با موفقیت وارد حساب کاربری خود شدید",
    Created = "با موفقیت ایجاد شد",
    Deleted = "با موفقیت حذف شد",
    Updated = "با موفقیت به روز رسانی شد",
    Inserted = "با موفقیت درج شد",
}
export enum ConflictMessage {
    CategoryTitle = "عنوان دسته بندی قبلا ثبت شده است",
    Phone = "موبایل توسط شخص دیگری استفاده شده",
}