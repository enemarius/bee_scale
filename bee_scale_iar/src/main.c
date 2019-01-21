#include "../inc/hw_memmap.h"
#include "../inc/hw_types.h"
#include "../inc/sysctl.h"
#include "../inc/gpio.h"
#include <stdint.h>

int PinData=2;

#define GPIO_PORTF_DATA     (*((volatile uint32_t *)(GPIO_PORTF_BASE + (0xFF << 2))))
#define GPIO_PORTF_PUR      (*((volatile uint32_t *)(GPIO_PORTF_BASE + 0x510)))
#define LED_RED             (0x01u << 1)
#define LED_BLUE            (0x01u << 2)
#define LED_GREEN           (0x01u << 3)

#define HX711_SCK_PIN       (0x01u << 1)
#define HX711_DT_PIN        (0x01u << 4)

int main()
{
  uint8_t i = 0U;
  
  SysCtlClockSet(SYSCTL_SYSDIV_5|SYSCTL_USE_PLL|SYSCTL_XTAL_16MHZ|SYSCTL_OSC_MAIN);

  SysCtlPeripheralEnable(SYSCTL_PERIPH_GPIOF);
  GPIOPinTypeGPIOOutput(GPIO_PORTF_BASE, GPIO_PIN_1|GPIO_PIN_2|GPIO_PIN_3);  
  GPIOPinTypeGPIOInput(GPIO_PORTF_BASE, GPIO_PIN_4);
  GPIO_PORTF_PUR = 0x000000FF;
  while(1)
  {
    //GPIOPinWrite(GPIO_PORTF_BASE, GPIO_PIN_1|GPIO_PIN_2|GPIO_PIN_3, PinData);
    //SysCtlDelay(2000000); /*   n * 3 cpu cycles */
    //GPIOPinWrite(GPIO_PORTF_BASE, GPIO_PIN_1|GPIO_PIN_2|GPIO_PIN_3, 0x00);
    //SysCtlDelay(2000000);
    //if(PinData==8)
    //{
    //  PinData=2;
    //}
    //else
    //{
    //  PinData=PinData*2;
    //}
    //GPIO_PORTF_DATA |= LED_RED; 
    //SysCtlDelay(2);
    //GPIO_PORTF_DATA |= LED_BLUE;
    //SysCtlDelay(10000000);
    //GPIO_PORTF_DATA |= LED_GREEN;
    //SysCtlDelay(10000000);
    
    //GPIO_PORTF_DATA &= ~LED_RED; 
    //SysCtlDelay(2);
    //GPIO_PORTF_DATA &= ~LED_BLUE;
    //SysCtlDelay(10000000);
    //GPIO_PORTF_DATA &= ~LED_GREEN;
    //SysCtlDelay(10000000);
    
    for(i=0; i<25; i++){
      GPIO_PORTF_DATA |= LED_RED; 
      SysCtlDelay(2);
      GPIO_PORTF_DATA &= ~LED_RED;
      SysCtlDelay(2);
    }
    
    if( 0U != (GPIO_PORTF_DATA & GPIO_PIN_4) ) {
        GPIO_PORTF_DATA |= LED_BLUE;
    } else {
        GPIO_PORTF_DATA &= ~LED_BLUE;
    }
    
    SysCtlDelay(10000000);
  }
        
  return 0;
}
