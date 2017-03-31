//
//  UIViewController+Vote.m
//  ScrumVoter
//
//  Created by Bane on 2017-03-30.
//  Copyright (c) 2017 GroupBy Inc. All rights reserved.
//

#import "VoteViewController.h"

#define SegueIdentifierWait @"embedWait"
#define SegueIdentifierVote @"embedVote"

@interface VoteViewController ()
    @property (nonatomic, weak) IBOutlet UILabel *idLabel;
    @property (nonatomic, weak) IBOutlet UILabel *titleLabel;
    @property (nonatomic, weak) IBOutlet UIPickerView *picker;

@end

@implementation VoteViewController
{
    NSArray *pickerData;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    // Initialize table data
    [self updateTicketWithId:@"SR-400" withTitle:@"Build this App" withValues:[NSArray arrayWithObjects:@"1", @"2", @"3", @"5", @"8", @"13", @"21", nil]];
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (NSInteger)numberOfComponentsInPickerView:(UIPickerView *)thePickerView {
    
    return 1;
}

- (NSInteger)pickerView:(UIPickerView *)thePickerView numberOfRowsInComponent:(NSInteger)component {
    
    return [pickerData count];//Or, return as suitable for you...normally we use array for dynamic
}

- (NSString *)pickerView:(UIPickerView *)thePickerView titleForRow:(NSInteger)row forComponent:(NSInteger)component {
    return [NSString stringWithFormat:@"%@", pickerData[row]];//Or, your suitable title; like Choice-a, etc.
}
- (IBAction)vote:(id)sender {
    //send vote
    [self performSegueWithIdentifier:SegueIdentifierWait sender:nil];
}

-(void)updateTicketWithId:(NSString*)ticketId withTitle:(NSString*)ticketTitle withValues:(NSArray*)values
{
    self.titleLabel.text = ticketTitle;
    self.idLabel.text = ticketId;
    pickerData = values;
    [self.picker reloadAllComponents];
    
    [self performSegueWithIdentifier:SegueIdentifierVote sender:nil];
}

- (void) displayContentController: (UIViewController*) content {
    [self addChildViewController:content];
    content.view.frame = [self frameForContentController];
    [self.view addSubview:self.currentClientView];
    [content didMoveToParentViewController:self];
}

- (void) hideContentController: (UIViewController*) content {
    [content willMoveToParentViewController:nil];
    [content.view removeFromSuperview];
    [content removeFromParentViewController];
}


@end
